import { Day } from "../day";

const START_NODE = "AAA";
const END_NODE = "ZZZ";
const LEFT = "L";
const RIGHT = "R";

type Node = {
  left: string;
  right: string;
};

type Nodes = { [key: string]: Node };

type NodeCache = {
  [key: number]: {
    [key: string]: { distanceToEnd: number; end: string };
  };
};

class Day8Solution extends Day {
  expectedTestValues = { part1: 2, part2: 6 };
  testFiles = { part1: "test.txt", part2: "test2.txt" };

  private getNodes(input: string[]): Nodes {
    const nodeRegex = /\w+/g;
    return input.reduce((prev: Nodes, curr) => {
      const [value, left, right] = [...curr.matchAll(nodeRegex)].map(
        (match) => match[0]
      );
      return { ...prev, [value]: { left, right } };
    }, {});
  }

  solvePart1(input: string[]): number {
    const directions = input[0];
    const nodes = this.getNodes(input.slice(2));
    let step = 0;
    let currentNode = START_NODE;
    while (currentNode !== END_NODE) {
      const direction = directions[step % directions.length];
      if (direction === LEFT) currentNode = nodes[currentNode].left;
      if (direction === RIGHT) currentNode = nodes[currentNode].right;
      step++;
    }
    return step;
  }

  private cache: NodeCache = {};
  private nodes: Nodes = {};
  private directions: string = "";

  followPath(
    path: string,
    initialStep: number
  ): { path: string; step: number } {
    let initalPath = path;
    let step = initialStep;
    const tmpCache: { path: string; step: number }[] = [];
    do {
      // If current value is cached use the cached value
      const nextDirection = step % this.directions.length;
      if (this.cache[nextDirection]?.[path]) {
        step += this.cache[nextDirection][path].distanceToEnd;
        path = this.cache[nextDirection][path].end;
      } else {
        // Add the new item to the temperary cache and get the next step in the path
        tmpCache.push({ path, step: step });
        const nextStep =
          this.directions[nextDirection] === RIGHT ? "right" : "left";
        path = this.nodes[path][nextStep];
        step++;
      }
    } while (!path.endsWith("Z"));
    // Once a ending is found update the main cache and return the ending
    tmpCache.forEach((val) => {
      const cacheKey = val.step % this.directions.length;
      if (!this.cache[cacheKey]) {
        this.cache[cacheKey] = {};
      }
      this.cache[cacheKey] = {
        ...this.cache[cacheKey],
        [val.path]: { distanceToEnd: step - val.step, end: path },
      };
    });
    if (path != initalPath) {
      console.log("Got different path", path, initalPath);
    }
    return { path, step };
  }

  async solvePart2(input: string[]): Promise<number> {
    this.directions = input[0];
    this.nodes = this.getNodes(input.slice(2));
    const distanceBetweenEnds: {
      [key: number]: { [key: string]: { path: string; step: number } };
    } = {};
    // Go through all the ending at every spot in the directions and find out how long it will take to get to each other ending
    const ends = Object.keys(this.nodes).filter((path) => path.endsWith("Z"));
    for (let i = 0; i < this.directions.length; i++) {
      const paths = ends.reduce(
        (prev, path) => ({ ...prev, [path]: this.followPath(path, i) }),
        {}
      );
      distanceBetweenEnds[i] = paths;
    }
    // Find the starts and get them to their first ends, sort the list after to match the ends array (Order doesn't matter steps tracked)
    let paths = Object.keys(this.nodes)
      .filter((path) => path.endsWith("A"))
      .map((path) => this.followPath(path, 0))
      .sort((a, b) => (a.path < b.path ? -1 : 1));
    let maxSteps = Math.max(...paths.map((path) => path.step));
    let allMax = false;
    console.log(
      "Got start",
      paths,
      "max step",
      maxSteps,
      "and ends",
      ends,
      distanceBetweenEnds
    );
    let count = 0;
    // while (!allMax) {
    //   if (count > 4) return 0;
    //   allMax = true;
    //   for (let i = 0; i < paths.length; i++) {
    //     console.log("Checking path", paths[i]);
    //     while (paths[i].step < maxSteps) {
    //       const currentDirection = paths[i].step % this.directions.length;
    //       const { path, step } =
    //         distanceBetweenEnds[currentDirection][paths[i].path];
    //       console.log("Adding value to path", path, step);
    //       paths[i] = { path, step: paths[i].step + step };
    //     }
    //     console.log("Got new path value", paths[i]);
    //     if (paths[i].step > maxSteps) {
    //       console.log("Overshot the max value... setting new value");
    //       allMax = false;
    //       maxSteps = paths[i].step;
    //     }
    //   }
    //   console.log("Got new paths", paths, "and max", maxSteps);
    //   count++;
    // }
    return 0;
  }
}

module.exports = new Day8Solution();

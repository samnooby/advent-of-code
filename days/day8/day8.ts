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

  private cache: { [key: string]: { distance: number; end: string } } = {};

  async getPathToEnd(
    initalPath: string,
    initalStep: number,
    nodes: Nodes,
    directions: string
  ): Promise<[string, number]> {
    let path = initalPath;
    let step = initalStep;
    let tmpCache: { [key: string]: number } = {};
    const transferCache = () => {
      Object.entries(tmpCache).forEach(([tmpKey, tmpVal]) => {
        this.cache[tmpKey] = {
          distance: step - tmpVal,
          end: path,
        };
      });
    };

    do {
      const cacheKey = `${path}${step % directions.length}`;
      console.log("Found cache value", cacheKey);
      if (this.cache[cacheKey]) {
        if (!cacheKey.endsWith("0")) {
          console.log("Found cache value in cache", cacheKey);
        }
        step = step + this.cache[cacheKey].distance;
        transferCache();
        return [this.cache[cacheKey].end, step];
      }
      tmpCache[cacheKey] = step;
      const direction =
        directions[step % directions.length] === RIGHT ? "right" : "left";
      path = nodes[path][direction];
      step++;
    } while (!path.endsWith("Z"));
    transferCache();

    return [path, step];
  }

  async solvePart2(input: string[]): Promise<number> {
    const directions = input[0];
    const nodes = this.getNodes(input.slice(2));
    const trackPath = (path: string, step: number) =>
      this.getPathToEnd(path, step, nodes, directions);
    // Get all the paths to the end
    let paths: [string, number][] = await Promise.all(
      Object.keys(nodes)
        .filter((node) => node.endsWith("A"))
        .map((start) => trackPath(start, 0))
    );
    // While all paths don't have the same length
    let steps = paths.map((path) => path[1]);
    while (!steps.every((s) => s === steps[0])) {
      const longestPath = Math.max(...steps);
      paths = await Promise.all(
        paths.map((path) =>
          path[1] === longestPath ? path : trackPath(path[0], path[1])
        )
      );
      steps = paths.map((path) => path[1]);
    }
    // console.log("Cache ", this.cache);
    return steps[0];
  }
}

module.exports = new Day8Solution();

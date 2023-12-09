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

  private nodes: Nodes = {};
  private directions: string = "";

  followPath(path: string, step: number): { path: string; step: number } {
    const initalStep = step;
    do {
      const nextDirection = step % this.directions.length;
      const nextStep =
        this.directions[nextDirection] === RIGHT ? "right" : "left";
      path = this.nodes[path][nextStep];
      step++;
    } while (!path.endsWith("Z"));
    return { path, step: step - initalStep };
  }

  async solvePart2(input: string[]): Promise<number> {
    this.directions = input[0];
    this.nodes = this.getNodes(input.slice(2));
    // Find the starts and get them to their first ends, sort the list after to match the ends array (Order doesn't matter steps tracked)
    let paths = Object.keys(this.nodes)
      .filter((path) => path.endsWith("A"))
      .map((path) => this.followPath(path, 0));

    // Find the least common multiple of all the paths
    const lcm = (a: number, b: number): number => {
      const gcd = (a: number, b: number): number =>
        b === 0 ? a : gcd(b, a % b);
      return (a * b) / gcd(a, b);
    };
    const smallestPath = paths.reduce((prev, curr) => {
      return lcm(prev, curr.step);
    }, paths[0].step);
    return smallestPath;
  }
}

module.exports = new Day8Solution();

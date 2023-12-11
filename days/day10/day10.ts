import { Day } from "../day";

enum Pipe {
  START = "S",
  UPDOWN = "|",
  LEFTRIGHT = "-",
  UPRIGHT = "L",
  UPLEFT = "J",
  DOWNLEFT = "7",
  DOWNRIGHT = "F",
}

const Pipes: { [key: string]: (point: Point, prev: Point) => Point } = {
  [Pipe.UPDOWN]: ({ x, y }: Point, { y: py }: Point): Point => {
    return { x, y: y > py ? y + 1 : y - 1 };
  },
  [Pipe.LEFTRIGHT]: ({ x, y }: Point, { x: px }: Point): Point => {
    return { x: x > px ? x + 1 : x - 1, y };
  },
  [Pipe.UPRIGHT]: ({ x, y }: Point, { x: px, y: py }: Point): Point => {
    return { x: x === px ? x + 1 : x, y: y === py ? y - 1 : y };
  },
  [Pipe.UPLEFT]: ({ x, y }: Point, { x: px, y: py }: Point): Point => {
    return { x: x === px ? x - 1 : x, y: y === py ? y - 1 : y };
  },
  [Pipe.DOWNLEFT]: ({ x, y }: Point, { x: px, y: py }: Point): Point => {
    return { x: x === px ? x - 1 : x, y: y === py ? y + 1 : y };
  },
  [Pipe.DOWNRIGHT]: ({ x, y }: Point, { x: px, y: py }: Point): Point => {
    return { x: x === px ? x + 1 : x, y: y === py ? y + 1 : y };
  },
};

type Point = { x: number; y: number };

class Day10Solution extends Day {
  expectedTestValues = { part1: 8, part2: 8 };
  testFiles = { part1: "test.txt", part2: "test2.txt" };

  private followPath(start: Point, point: Point, input: string[]): number {
    let currentPoint = point;
    let previousPoint = start;
    let total = 1;
    while (currentPoint.x !== start.x || currentPoint.y !== start.y) {
      total++;
      const currentPipe = input[currentPoint.y][currentPoint.x];
      const tmpPoint = currentPoint;
      currentPoint = Pipes[currentPipe](currentPoint, previousPoint);
      previousPoint = tmpPoint;
    }
    return total / 2;
  }

  private findStart(start: Point, input: string[]): Point[] {
    const { x, y } = start;
    const [up, down, left, right] = [
      input[y - 1][x],
      input[y + 1][x],
      input[y][x - 1],
      input[y][x + 1],
    ] as Pipe[];
    const validStarts: Point[] = [];
    if ([Pipe.UPDOWN, Pipe.DOWNLEFT, Pipe.DOWNRIGHT].includes(up)) {
      validStarts.push({ x, y: y - 1 });
    }
    if ([Pipe.UPDOWN, Pipe.UPLEFT, Pipe.UPRIGHT].includes(down)) {
      validStarts.push({ x, y: y + 1 });
    }
    if ([Pipe.LEFTRIGHT, Pipe.UPRIGHT, Pipe.DOWNRIGHT].includes(left)) {
      validStarts.push({ x: x - 1, y });
    }
    if ([Pipe.LEFTRIGHT, Pipe.UPLEFT, Pipe.DOWNLEFT].includes(right)) {
      validStarts.push({ x: x + 1, y });
    }
    return validStarts;
  }

  solvePart1(input: string[]): number {
    // Find the starting point
    const y = input.findIndex((v) => v.includes(Pipe.START));
    const x = input[y].indexOf(Pipe.START);
    const start: Point = { x, y };

    const nextPoint = this.findStart(start, input);
    return this.followPath(start, nextPoint[0], input);
  }

  private getPathMap(start: Point, next: Point, input: string[]): string[][] {
    const pathMap = input.map((v) => v.split("").map((v) => "."));
    let currentPoint = next;
    let previousPoint = start;
    while (currentPoint.x !== start.x || currentPoint.y !== start.y) {
      const currentPipe = input[currentPoint.y][currentPoint.x];
      pathMap[currentPoint.y][currentPoint.x] = currentPipe;
      const tmpPoint = currentPoint;
      currentPoint = Pipes[currentPipe](currentPoint, previousPoint);
      previousPoint = tmpPoint;
    }
    pathMap[currentPoint.y][currentPoint.x] = Pipe.START;

    return pathMap;
  }

  private breathMap(input: string[][]): string[][] {
    let breathedOn = input.map((p) =>
      p.reduce((p: string[], c, i, arr) => {
        const isLeftRight =
          c === Pipe.LEFTRIGHT || c === Pipe.DOWNRIGHT || c === Pipe.UPRIGHT;
        return [...p, c, isLeftRight ? Pipe.LEFTRIGHT : `.`];
      }, [])
    );
    return breathedOn.reduce((prev: string[][], curr) => {
      const nextRow: string[] = curr.map((v) => {
        const isUpdown =
          v === Pipe.UPDOWN || v === Pipe.DOWNRIGHT || v === Pipe.DOWNLEFT;
        return isUpdown ? "|" : ".";
      });
      return [...prev, curr, nextRow];
    }, []);
  }

  private replaceStartWithPipe(input: string[][], validStarts: Point[]): Pipe {
    const [path1, path2] = validStarts;
    if (path1.y === path2.y) Pipe.LEFTRIGHT;
    else if (path1.x > path2.x) {
      if (path1.y > path2.y) return Pipe.DOWNLEFT;
      return Pipe.UPLEFT;
    } else if (path1.x < path2.x) {
      if (path1.y > path2.y) return Pipe.DOWNRIGHT;
      return Pipe.UPRIGHT;
    }
    return Pipe.UPDOWN;
  }

  private checkPoint({ x, y }: Point) {
    this.pipeMap[y][x] = "I";
    const isEdge =
      y === 0 ||
      x === 0 ||
      y === this.pipeMap.length - 1 ||
      x === this.pipeMap[y].length - 1;
    const sideValues: Point[] = [
      { x: x - 1, y },
      { x: x + 1, y },
      { x, y: y - 1 },
      { x, y: y + 1 },
    ];
    const sides = sideValues.map((v) => this.pipeMap[v?.y]?.[v?.x]);
    const edgeContainsS = sides.includes("0");
    if (isEdge || edgeContainsS) {
      this.pipeMap[y][x] = "0";
      for (let i = 0; i < sides.length; i++) {
        if (sides[i] === "I") {
          this.pipeMap[sideValues[i].y][sideValues[i].x] = ".";
        }
      }
    }
  }

  firstMap: string[][] = [];
  pipeMap: string[][] = [];

  solvePart2(input: string[]): number {
    // Find the starting point
    let y = input.findIndex((v) => v.includes(Pipe.START));
    let x = input[y].indexOf(Pipe.START);
    const start: Point = { x, y };

    const validStarts = this.findStart(start, input);
    this.firstMap = this.getPathMap(start, validStarts[0], input);

    this.firstMap[start.y][start.x] = this.replaceStartWithPipe(
      this.firstMap,
      validStarts
    );
    this.pipeMap = this.breathMap(this.firstMap);
    // Replace all '.' with 'I' if inside the cycle or '0' if outside the cycle
    y = this.pipeMap.findIndex((v) => v.includes("."));
    x = this.pipeMap[y]?.indexOf(".") ?? -1;
    while (x !== -1 && y !== -1) {
      this.checkPoint({ x, y });
      y = this.pipeMap.findIndex((v) => v.includes("."));
      x = this.pipeMap[y]?.indexOf(".") ?? -1;
    }

    // Go through each '.' on the first map and check if it is inside the cylce with the pipe map
    let total = 0;
    for (let i = 0; i < this.firstMap.length; i++) {
      for (let j = 0; j < this.firstMap[i].length; j++) {
        if (this.firstMap[i][j] === ".") {
          const mappedPoint = this.pipeMap[i * 2][j * 2];
          total = total + (mappedPoint === "I" ? 1 : 0);
        }
      }
    }

    return total;
  }
}

module.exports = new Day10Solution();

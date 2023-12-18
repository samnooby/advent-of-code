import { readFileSync } from "fs";

export type TestResult<R> = {
  passed: Boolean;
  value: R;
  expected: R;
  runtime: string;
};

export type RunResult<R> = {
  value: R;
  runtime: string;
};

type Parts<P1, P2 = P1> = {
  part1: P1;
  part2: P2;
};

type DayOutput<P1, P2 = P1> = { dayNumber: number } & Parts<P1, P2>;

export abstract class Day<P1 = number, P2 = P1> {
  testFiles: Parts<string> = {
    part1: "test.txt",
    part2: "test.txt",
  };

  solutionFiles: Parts<string> = {
    part1: "input.txt",
    part2: "input.txt",
  };

  abstract expectedTestValues: Parts<P1, P2>;
  abstract solvePart1(input: string[], isTest?: boolean): P1 | Promise<P1>;
  abstract solvePart2(input: string[], isTest?: boolean): P2 | Promise<P2>;

  private convertInputToString = (
    file: string,
    dayNumber: number
  ): string[] => {
    return readFileSync(`./days/day${dayNumber}/${file}`)
      .toString()
      .split("\n");
  };

  async solvePart1Async(input: string[], isTest?: boolean): Promise<P1> {
    return Promise.resolve(this.solvePart1(input, isTest));
  }

  async solvePart2Async(input: string[], isTest?: boolean): Promise<P2> {
    return Promise.resolve(this.solvePart2(input, isTest));
  }

  async run(
    dayNumber: number
  ): Promise<DayOutput<RunResult<P1>, RunResult<P2>>> {
    const part1Input = this.convertInputToString(
      this.solutionFiles.part1,
      dayNumber
    );
    const part2Input = this.convertInputToString(
      this.solutionFiles.part2,
      dayNumber
    );
    const p1Start = performance.now();
    const part1Value = await this.solvePart1Async(part1Input, false);
    const p1End = performance.now();
    const p2Start = performance.now();
    const part2Value = await this.solvePart2Async(part2Input, false);
    const p2End = performance.now();
    return {
      dayNumber,
      part1: {
        value: part1Value,
        runtime: `${Math.round((p1End - p1Start) * 1000) / 1000}ms`,
      },
      part2: {
        value: part2Value,
        runtime: `${Math.round((p2End - p2Start) * 1000) / 1000}ms`,
      },
    };
  }

  async test(
    dayNumber: number
  ): Promise<DayOutput<TestResult<P1>, TestResult<P2>>> {
    const part1Input = this.convertInputToString(
      this.testFiles.part1,
      dayNumber
    );
    const part2Input = this.convertInputToString(
      this.testFiles.part2,
      dayNumber
    );
    const p1Start = performance.now();
    const part1Value = await this.solvePart1Async(part1Input, true);
    const p1End = performance.now();
    const p2Start = performance.now();
    const part2Value = await this.solvePart2Async(part2Input, true);
    const p2End = performance.now();
    return {
      dayNumber,
      part1: {
        passed: part1Value === this.expectedTestValues.part1,
        value: part1Value,
        expected: this.expectedTestValues.part1,
        runtime: `${Math.round((p1End - p1Start) * 1000) / 1000}ms`,
      },
      part2: {
        passed: part2Value === this.expectedTestValues.part2,
        value: part2Value,
        expected: this.expectedTestValues.part2,
        runtime: `${Math.round((p2End - p2Start) * 1000) / 1000}ms`,
      },
    };
  }
}

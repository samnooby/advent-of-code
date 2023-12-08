import { readFileSync } from "fs";

export type TestResult<R> = {
  passed: Boolean;
  value: R;
  expected: R;
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
  abstract solvePart1(input: string[]): P1 | Promise<P1>;
  abstract solvePart2(input: string[]): P2 | Promise<P2>;

  private convertInputToString = (
    file: string,
    dayNumber: number
  ): string[] => {
    return readFileSync(`./days/day${dayNumber}/${file}`)
      .toString()
      .split("\n");
  };

  async solvePart1Async(input: string[]): Promise<P1> {
    return Promise.resolve(this.solvePart1(input));
  }

  async solvePart2Async(input: string[]): Promise<P2> {
    return Promise.resolve(this.solvePart2(input));
  }

  async run(dayNumber: number): Promise<DayOutput<P1, P2>> {
    const part1Input = this.convertInputToString(
      this.solutionFiles.part1,
      dayNumber
    );
    const part2Input = this.convertInputToString(
      this.solutionFiles.part2,
      dayNumber
    );
    const [part1, part2] = await Promise.all([
      this.solvePart1Async(part1Input),
      this.solvePart2Async(part2Input),
    ]);
    return {
      dayNumber,
      part1,
      part2,
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
    const [part1Value, part2Value] = await Promise.all([
      this.solvePart1Async(part1Input),
      this.solvePart2Async(part2Input),
    ]);
    return {
      dayNumber,
      part1: {
        passed: part1Value === this.expectedTestValues.part1,
        value: part1Value,
        expected: this.expectedTestValues.part1,
      },
      part2: {
        passed: part2Value === this.expectedTestValues.part2,
        value: part2Value,
        expected: this.expectedTestValues.part2,
      },
    };
  }
}

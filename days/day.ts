import * as fs from "fs";

export type TestResult<R> = {
  passed: Boolean;
  value: R;
  expected: R;
};

type Parts<P1, P2 = P1> = {
  part1: P1;
  part2: P2;
};

export abstract class Day<P1 = string, P2 = P1> {
  abstract dayNumber: number;

  testFiles: Parts<string> = {
    part1: "test.txt",
    part2: "test.txt",
  };

  solutionFiles: Parts<string> = {
    part1: "input.txt",
    part2: "input.txt",
  };

  abstract expectedTestValues: Parts<P1, P2>;
  abstract solvePart1(input: string[]): P1;
  abstract solvePart2(input: string[]): P2;

  private convertInputToString = (file: string): string[] => {
    return fs
      .readFileSync(`./days/day${this.dayNumber}/${file}`)
      .toString()
      .split("\n");
  };

  run(): Parts<P1, P2> {
    const part1Input = this.convertInputToString(this.solutionFiles.part1);
    const part2Input = this.convertInputToString(this.solutionFiles.part2);
    return {
      part1: this.solvePart1(part1Input),
      part2: this.solvePart2(part2Input),
    };
  }

  test(): Parts<TestResult<P1>, TestResult<P2>> {
    const part1Input = this.convertInputToString(this.testFiles.part1);
    const part2Input = this.convertInputToString(this.testFiles.part2);
    const part1Value = this.solvePart1(part1Input);
    const part2Value = this.solvePart2(part2Input);
    return {
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

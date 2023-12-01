import * as fs from "fs";

export type Solution = (input: string[]) => string;

export type Test = {
  file: string;
  expected: string;
  solution: Solution;
};

export type Solutions = {
  file: string;
  solution: Solution;
};

export abstract class Day {
  abstract dayNumber: number;
  abstract tests: Test[];
  abstract solutions: Solutions[];

  run(): string[] {
    return this.solutions.map(({ file, solution }) => {
      const input = fs
        .readFileSync(`'./days/day${this.dayNumber}/${file}`)
        .toString()
        .split("\n");
      return solution(input);
    });
  }

  test(): { passed: Boolean; value: string; expected: string }[] {
    return this.tests.map(({ file, expected, solution }) => {
      const input = fs
        .readFileSync(`./days/day${this.dayNumber}/${file}`)
        .toString()
        .split("\n");
      const value = solution(input);
      return {
        passed: value === expected,
        value,
        expected: expected,
      };
    });
  }
}

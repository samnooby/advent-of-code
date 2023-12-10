import { Day } from "../day";

class Day9Solution extends Day {
  expectedTestValues = { part1: 114, part2: 2 };

  private findNextValue(input: number[]): number {
    const differences: number[] = [];
    for (let i = 0; i < input.length - 1; i++) {
      differences.push(input[i + 1] - input[i]);
    }
    if (differences.every((val) => val === differences[0])) {
      return input[input.length - 1] + differences[0];
    }
    return input[input.length - 1] + this.findNextValue(differences);
  }

  solvePart1(input: string[]): number {
    const nextNumbers = input.map((sequence) =>
      this.findNextValue(sequence.split(" ").map((val) => +val))
    );
    return nextNumbers.reduce((prev, curr) => prev + curr, 0);
  }

  private findFirstValue(input: number[]): number {
    const differences: number[] = [];
    for (let i = 0; i < input.length - 1; i++) {
      differences.push(input[i + 1] - input[i]);
    }
    if (differences.every((val) => val === differences[0])) {
      return input[0] - differences[0];
    }
    const nextValue = input[0] - this.findFirstValue(differences);
    return nextValue;
  }

  solvePart2(input: string[]): number {
    const nextNumbers = input.map((sequence) =>
      this.findFirstValue(sequence.split(" ").map((val) => +val))
    );
    return nextNumbers.reduce((prev, curr) => prev + curr, 0);
  }
}

module.exports = new Day9Solution();

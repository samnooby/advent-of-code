import { Day } from "../day";

class Day1Solution extends Day {
  dayNumber: number = 1;
  expectedTestValues = { part1: 142, part2: 281 };
  testFiles = { part1: "test1.txt", part2: "test2.txt" };

  solvePart1(input: string[]) {
    const solution = input.reduce((prev: number, curr: String) => {
      // Get all digits and create calibration number
      const digits = curr
        .split("")
        .filter((c) => !isNaN(+c))
        .map((c) => +c);
      const calibration = +`${digits.at(0)}${digits.at(-1)}`;
      return prev + calibration;
    }, 0);
    return solution;
  }

  solvePart2(input: string[]) {
    const solution = input.reduce((prev: number, curr: String) => {
      // Get first and last digits and create calibration number
      const calibration = +`${this.getFirstDigit(curr)}${this.getLastDigit(
        curr
      )}`;
      return prev + calibration;
    }, 0);
    return solution;
  }

  numbers = [
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
  ];

  private getFirstDigit(input: String): number {
    let cursor = 0;
    while (cursor < input.length) {
      if (!isNaN(+input[cursor])) {
        return +input[cursor];
      }
      // Return the index of the first number found if found
      for (let i = 0; i < this.numbers.length; i++) {
        if (input.substring(0, cursor + 1).includes(this.numbers[i])) {
          return i + 1;
        }
      }
      cursor++;
    }
    throw Error("No digit found");
  }

  private getLastDigit(input: String): number {
    let cursor = input.length - 1;
    while (cursor >= 0) {
      if (!isNaN(+input[cursor])) {
        return +input[cursor];
      }
      for (let i = 0; i < this.numbers.length; i++) {
        if (input.substring(cursor).includes(this.numbers[i])) {
          return i + 1;
        }
      }
      cursor--;
    }
    throw Error("No digit found");
  }
}

module.exports = new Day1Solution();

import { Day, Solution, Solutions, Test } from "../day";

class Day1Solution extends Day {
  private solvePart1: Solution = (input) => {
    const solution = input.reduce((prev: number, curr: String) => {
      // Get all digits and create calibration number
      const digits = curr
        .split("")
        .filter((c) => !isNaN(+c))
        .map((c) => +c);
      const calibration = +`${digits.at(0)}${digits.at(-1)}`;
      return prev + calibration;
    }, 0);
    return `${solution}`;
  };

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

  private solvePart2: Solution = (input) => {
    const solution = input.reduce((prev: number, curr: String) => {
      // Get first and last digits and create calibration number
      const calibration = +`${this.getFirstDigit(curr)}${this.getLastDigit(
        curr
      )}`;
      return prev + calibration;
    }, 0);
    return `${solution}`;
  };

  dayNumber: number = 1;
  tests: Test[] = [
    { file: "test1.txt", expected: "142", solution: this.solvePart1 },
    { file: "test2.txt", expected: "281", solution: this.solvePart2 },
  ];
  solutions: Solutions[] = [
    { file: "input.txt", solution: this.solvePart1 },
    { file: "input.txt", solution: this.solvePart2 },
  ];
}

const Day1 = new Day1Solution();
export { Day1 };

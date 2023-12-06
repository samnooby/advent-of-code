import { Day, Solution, Solutions, Test } from "../day";

const CHARGERATEPERMS = 1;

class Day6Solution extends Day {
  dayNumber: number = 6;

  private getDigits = (input: string): number[] => {
    const regex = /\d+/g;
    return Array.from(input.matchAll(regex)).map((match) => +match[0]);
  };

  private getNumWins = (time: number, distance: number): number => {
    const plus = (time + Math.sqrt(time ** 2 - 4 * distance)) / 2;
    const minus = (time - Math.sqrt(time ** 2 - 4 * distance)) / 2;
    let end = Math.floor(plus);
    let start = Math.ceil(minus);
    if (end === plus) end--;
    if (start === minus) start++;
    return end - start + 1;
  };

  private solvePart1: Solution = (input) => {
    const [times, distances] = input.map((input) => this.getDigits(input));
    const total = times.reduce((prev: number, curr, i) => {
      return prev * this.getNumWins(curr, distances[i]);
    }, 1);
    return `${total}`;
  };

  private solvePart2: Solution = (input) => {
    const [time, distance] = input.map((input) =>
      this.getDigits(input).reduce((prev, curr) => {
        return +`${prev}${curr}`;
      })
    );
    return `${this.getNumWins(time, distance)}`;
  };

  tests = [
    { file: "test.txt", expected: "288", solution: this.solvePart1 },
    { file: "test.txt", expected: "71503", solution: this.solvePart2 },
  ];
  solutions = [
    { file: "input.txt", solution: this.solvePart1 },
    { file: "input.txt", solution: this.solvePart2 },
  ];
}

const Day6 = new Day6Solution();
export { Day6 };

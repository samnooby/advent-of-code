import { Day } from "../day";

class Day6Solution extends Day {
  dayNumber: number = 6;
  expectedTestValues = { part1: 288, part2: 71503 };

  solvePart1(input: string[]) {
    const [times, distances] = input.map((input) => this.getDigits(input));
    const total = times.reduce((prev: number, curr, i) => {
      return prev * this.getNumWins(curr, distances[i]);
    }, 1);
    return total;
  }

  solvePart2(input: string[]) {
    const [time, distance] = input.map((input) =>
      this.getDigits(input).reduce((prev, curr) => {
        return +`${prev}${curr}`;
      })
    );
    return this.getNumWins(time, distance);
  }

  private getDigits = (input: string): number[] => {
    const regex = /\d+/g;
    return Array.from(input.matchAll(regex)).map((match) => +match[0]);
  };

  private getNumWins = (time: number, distance: number): number => {
    const plus = (time + Math.sqrt(time ** 2 - 4 * distance)) / 2;
    const minus = (time - Math.sqrt(time ** 2 - 4 * distance)) / 2;
    return Math.ceil(plus - 1) - Math.floor(minus + 1) + 1;
  };
}

const Day6 = new Day6Solution();
export { Day6 };

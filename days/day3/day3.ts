import { Day } from "../day";

type Point = {
  x: number;
  y: number;
};

type FoundNumber = {
  value: number;
  start: number;
  end: number;
  row: number;
};

class Day3Solution extends Day {
  dayNumber = 3;
  expectedTestValues = { part1: 4361, part2: 467835 };

  solvePart1(input: string[]) {
    const numbers: FoundNumber[] = input.reduce(
      (prev: FoundNumber[], curr, i) => {
        return [...prev, ...this.findNumbers(curr, i)];
      },
      []
    );
    const solution = this.addValidNumbers(input, numbers);
    return solution;
  }

  solvePart2(input: string[]) {
    // Get all gears and numbers
    const gears: Point[] = input.reduce((prev: Point[], curr, i) => {
      return [...prev, ...this.findGears(curr, i)];
    }, []);
    const numbers: FoundNumber[] = input.reduce(
      (prev: FoundNumber[], curr, i) => {
        return [...prev, ...this.findNumbers(curr, i)];
      },
      []
    );
    const total = gears.reduce((prev: number, gear) => {
      // Find numbers within range of the gear
      const { x, y } = gear;
      const nearbyNumbers = numbers.filter(({ start, end, row }) => {
        return start - 1 <= x && x <= end && row - 1 <= y && y <= row + 1;
      });
      // If 2+ numbers nearby, add the product of the values to the total
      if (nearbyNumbers.length > 1) {
        const gearRatio = nearbyNumbers.reduce((prev: number, curr) => {
          return prev * curr.value;
        }, 1);
        return prev + gearRatio;
      }
      return prev;
    }, 0);
    return total;
  }

  // findNumbers returns a list of FoundNumbers containing all the numbers from the input string
  private findNumbers(input: String, row: number): FoundNumber[] {
    const regex = /(\d+)/g;
    const matches = [...input.matchAll(regex)];
    return matches.map((match) => {
      if (match.index === undefined) {
        throw Error("Match index not found");
      }
      return {
        value: +match[0],
        start: match.index,
        end: match.index + match[0].length,
        row,
      };
    });
  }

  // checkLocation checks if the given location is a symbol (Not a digit or a .)
  private checkLocation(x: number, y: number, input: string[]): boolean {
    try {
      const val = input[y][x];
      if (isNaN(+val) && val !== "." && val !== undefined) {
        return true;
      }
    } catch (err) {
      return false;
    }
    return false;
  }

  // addValidNumbers sums all foundNumbers values that contain at least 1 neighbouring symbol
  private addValidNumbers(input: string[], numbers: FoundNumber[]): number {
    return numbers.reduce((prev: number, curr: FoundNumber) => {
      for (let x = curr.start - 1; x < curr.end + 1; x++) {
        if (this.checkLocation(x, curr.row - 1, input)) {
          return prev + curr.value;
        }
        if (this.checkLocation(x, curr.row, input)) {
          return prev + curr.value;
        }
        if (this.checkLocation(x, curr.row + 1, input)) {
          return prev + curr.value;
        }
      }
      return prev;
    }, 0);
  }

  private findGears(input: String, row: number): Point[] {
    const regex = /(\*)/g;
    const matches = [...input.matchAll(regex)];
    return matches.map((match) => {
      if (!match.index) throw Error("No index found");
      return {
        x: match.index,
        y: row,
      };
    });
  }
}

const Day3 = new Day3Solution();
export { Day3 };

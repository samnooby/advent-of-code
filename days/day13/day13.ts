import { Day } from "../day";

class Day13Solution extends Day {
  expectedTestValues = { part1: 405, part2: 0 };

  private getPatterns(input: string[]): string[][] {
    return input.reduce(
      (p: string[][], c) => {
        if (c.length === 0) return [...p, []];
        const newLast = [...p[p.length - 1], c];
        return [...p.slice(0, -1), newLast];
      },
      [[]]
    );
  }

  private findReflection(pattern: string[]): [number, number] | null {
    const matchingRows: { [key: number]: number[] } = {};
    // Go through and map each row to thr rows that match it
    for (let i = 0; i < pattern.length; i++) {
      matchingRows[i] = [];
      for (let j = 0; j < pattern.length; j++) {
        if (i !== j && pattern[i] === pattern[j]) {
          matchingRows[i] = [...matchingRows[i], j];
        }
      }
    }
    // Check the first and last rows for a reflection
    for (const row of [0, pattern.length - 1]) {
      const flip = this.findFlip(matchingRows, row);
      if (flip !== null) return flip;
    }
    return null;
  }

  private findFlip(
    rows: { [key: number]: number[] },
    row: number
  ): [number, number] | null {
    let flip: [number, number] | null = null;
    // Go through each match and see if the rows between them are also matches
    for (const match of rows[row]) {
      const bottom = Math.min(row, match);
      const top = Math.max(row, match);
      const difference = (top - bottom) / 2;
      flip = [
        bottom + Math.ceil(difference),
        bottom + Math.ceil(difference) + 1,
      ];
      for (let i = 0; i < difference; i++) {
        if (!rows[bottom + i].includes(top - i)) {
          flip = null;
          break;
        }
      }
      if (flip !== null) break;
    }
    return flip;
  }

  solvePart1(input: string[]): number {
    const patterns = this.getPatterns(input);
    const total = patterns.reduce((p, c) => {
      const reflectedRows = this.findReflection(c);
      if (reflectedRows) return p + reflectedRows[0] * 100;
      const flippedPattern: string[] = [];
      for (let i = 0; i < c[0].length; i++) {
        flippedPattern.push(c.map((row) => row[i]).join(""));
      }
      const reflectedColumns = this.findReflection(flippedPattern);
      if (reflectedColumns) return p + reflectedColumns[0];
      throw new Error(`No reflection found \n ${c.join("\n")}`);
    }, 0);
    const rows = patterns.map((c) => {
      const reflectedRows = this.findReflection(c);
      if (reflectedRows) return [reflectedRows, reflectedRows[0] * 100];
      const flippedPattern: string[] = [];
      for (let i = 0; i < c[0].length; i++) {
        flippedPattern.push(c.map((row) => row[i]).join(""));
      }
      const reflectedColumns = this.findReflection(flippedPattern);
      if (reflectedColumns) return [reflectedColumns, reflectedColumns[0]];
    });
    console.log(rows.map((p) => `${p![0]} - ${p![1]}`).join("\n"));
    return total;
  }

  solvePart2(input: string[]): number {
    return 1;
  }
}

module.exports = new Day13Solution();

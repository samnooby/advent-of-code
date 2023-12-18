import { Day } from "../day";

type MatchingRow = {
  value: number;
  isDifferent: boolean;
};

type MatchingRows = {
  [key: number]: MatchingRow[];
};

class Day13Solution extends Day {
  expectedTestValues = { part1: 405, part2: 400 };

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
      for (let i = 0; i < difference + 1; i++) {
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
    return total;
  }

  private findMatchingRows(pattern: string[]): MatchingRows {
    const matchingRows: MatchingRows = {};
    // Compare each row to each other row
    for (let i = 0; i < pattern.length; i++) {
      matchingRows[i] = [];
      for (let ii = 0; ii < pattern.length; ii++) {
        // If there is 0 or one difference in the row, add it to the list of matching rows
        if (i !== ii) {
          let mistakes = 0;
          for (let iii = 0; iii < pattern[0].length; iii++) {
            if (pattern[i][iii] !== pattern[ii][iii]) {
              mistakes++;
              if (mistakes > 1) break;
            }
          }
          if (mistakes <= 1) {
            matchingRows[i] = [
              ...matchingRows[i],
              { value: ii, isDifferent: mistakes === 1 },
            ];
          }
        }
      }
    }
    return matchingRows;
  }

  private findReflectionWithMistakes(
    matches: MatchingRows
  ): [number, number] | null {
    let flip: [number, number] | null = null;
    for (const row of [0, Object.keys(matches).length - 1]) {
      // Check the first and last row (They are needed for reflection)
      for (const match of matches[row]) {
        // Go through each match the row has and see if the rows between them are also matches
        let mistakes = match.isDifferent ? 1 : 0;
        const bottom = Math.min(row, match.value);
        const top = Math.max(row, match.value);
        const difference = (top - bottom) / 2;
        flip = [
          bottom + Math.ceil(difference),
          bottom + Math.ceil(difference) + 1,
        ];
        for (let i = 1; i < difference + 1; i++) {
          // If the row is different, add it to the mistakes. Once there are more than 1 mistakes, it is not a valid reflection
          let match = matches[bottom + i].find((m) => m.value === top - i);
          if (match?.isDifferent === true && bottom + i < top - i) mistakes++;
          if (!match || mistakes > 1) {
            flip = null;
            break;
          }
        }
        // If there are not mistakes then it is not a different reflection and not valid
        if (mistakes === 0) flip = null;
        if (flip !== null) return flip;
      }
    }
    return flip;
  }

  solvePart2(input: string[]): number {
    const patterns = this.getPatterns(input);
    const total = patterns.reduce((p, c) => {
      const matches = this.findMatchingRows(c);
      const reflectedRows = this.findReflectionWithMistakes(matches);
      if (reflectedRows) return p + reflectedRows[0] * 100;
      const flippedPattern: string[] = [];
      for (let i = 0; i < c[0].length; i++) {
        flippedPattern.push(c.map((row) => row[i]).join(""));
      }
      const columnMatches = this.findMatchingRows(flippedPattern);
      const reflectedColumns = this.findReflectionWithMistakes(columnMatches);
      if (reflectedColumns) return p + reflectedColumns[0];
      return p;
      // throw new Error(`No reflection found \n${c.join("\n")}`);
    }, 0);
    return total;
  }
}

module.exports = new Day13Solution();

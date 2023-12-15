import { Day } from "../day";

type Point = { x: number; y: number };

class Day11Solution extends Day {
  expectedTestValues = { part1: 374, part2: 8410 };

  private getEmptyRowsAndColumns(galaxy: string[]): [number[], number[]] {
    const isRowEmpty: boolean[] = galaxy.map(() => true);
    const isColumnEmpty: boolean[] = galaxy[0].split("").map(() => true);
    for (let i = 0; i < galaxy.length; i++) {
      for (let j = 0; j < galaxy[i].length; j++) {
        isColumnEmpty[j] = isColumnEmpty[j] && galaxy[i][j] === ".";
        isRowEmpty[i] = isRowEmpty[i] && galaxy[i][j] === ".";
      }
    }

    const emptyRows = isRowEmpty.reduce((p: number[], c, i) => {
      if (c) return [...p, i];
      return p;
    }, []);
    const emptyColumns = isColumnEmpty.reduce((p: number[], c, i) => {
      if (c) return [...p, i];
      return p;
    }, []);

    return [emptyRows, emptyColumns];
  }

  private getStars(input: string[]): Point[] {
    return input.reduce((prev: Point[], curr, row) => {
      return [
        ...prev,
        ...curr.split("").reduce((p: Point[], c, column) => {
          if (c === "#") {
            return [...p, { x: column, y: row }];
          }
          return p;
        }, []),
      ];
    }, []);
  }

  solvePart1(input: string[]): number {
    const [emptyRows, emptyColumns] = this.getEmptyRowsAndColumns(input);
    const stars = this.getStars(input);

    let total = 0;
    stars.forEach(({ x, y }, i) => {
      stars.slice(i + 1).forEach(({ x: x2, y: y2 }) => {
        const left = x > x2 ? x2 : x;
        const right = x > x2 ? x : x2;
        const doubledRows = emptyRows.filter((r) => r > y && r < y2);
        const doubledColumns = emptyColumns.filter(
          (c) => c > left && c < right
        );
        if (right - left < 0) throw Error("Small x");
        if (y2 - y < 0) throw Error("Small y");

        total +=
          right - left + y2 - y + doubledRows.length + doubledColumns.length;
      });
    });

    return total;
  }

  solvePart2(input: string[], isTest: boolean): number {
    const [emptyRows, emptyColumns] = this.getEmptyRowsAndColumns(input);
    const stars = this.getStars(input);

    const ROW_MULITPLIER = isTest ? 100 : 1000000;
    const COLUMN_MULITPLIER = isTest ? 100 : 1000000;
    let total = 0;
    stars.forEach(({ x, y }, i) => {
      stars.slice(i + 1).forEach(({ x: x2, y: y2 }) => {
        const left = x > x2 ? x2 : x;
        const right = x > x2 ? x : x2;
        const doubledRows = emptyRows.filter((r) => r > y && r < y2);
        const doubledColumns = emptyColumns.filter(
          (c) => c > left && c < right
        );

        total +=
          right -
          left +
          y2 -
          y +
          doubledRows.length * (ROW_MULITPLIER - 1) +
          doubledColumns.length * (COLUMN_MULITPLIER - 1);
      });
    });

    return total;
  }
}

module.exports = new Day11Solution();

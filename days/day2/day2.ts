import { Day } from "../day";

const MAX_RED = 12;
const MAX_GREEN = 13;
const MAX_BLUE = 14;

class Day2Solution extends Day<number> {
  dayNumber: number = 2;
  expectedTestValues = { part1: 8, part2: 2286 };

  private gameIdRegex = /Game (\d+)/;
  private redRegex = /(?<value>\d+) red/g;
  private blueRegex = /(?<value>\d+) blue/g;
  private greenRegex = /(?<value>\d+) green/g;

  solvePart1(input: string[]): number {
    const acceptedGames = input.reduce((prev: number, curr: string) => {
      // Check each color if it is ever over the max
      if (!this.isGameValid(curr, this.redRegex, MAX_RED)) return prev;
      if (!this.isGameValid(curr, this.blueRegex, MAX_BLUE)) return prev;
      if (!this.isGameValid(curr, this.greenRegex, MAX_GREEN)) return prev;

      // Get the game id
      const gameId = curr.match(this.gameIdRegex);
      if (gameId) {
        return prev + +gameId[1];
      }
      throw Error("No game id found");
    }, 0);
    return acceptedGames;
  }
  solvePart2(input: string[]): number {
    const answer = input.reduce((prev: number, game: string) => {
      const maxRed = this.findMax(game, this.redRegex);
      const maxGreen = this.findMax(game, this.greenRegex);
      const maxBlue = this.findMax(game, this.blueRegex);
      const power = maxRed * maxGreen * maxBlue;
      return prev + power;
    }, 0);
    return answer;
  }

  private isGameValid = (game: String, regex: RegExp, max: number): Boolean => {
    // Check if any of the values go above the max
    const matches = game.matchAll(regex);
    for (const match of matches) {
      if (+(match.groups?.value || 0) > max) return false;
    }
    return true;
  };

  private findMax = (game: String, regex: RegExp): number => {
    const matches = Array.from(
      game.matchAll(regex),
      (m) => +(m.groups?.value || 0)
    );
    return Math.max(...matches);
  };
}

const Day2 = new Day2Solution();
export { Day2 };

import { Day } from "../day";

class Day12Solution extends Day {
  expectedTestValues = { part1: 21, part2: 525152 };

  private getAllValid(map: string, group: number): string[] {
    const valid: string[] = [];
    let newMap = map;
    const regex = new RegExp(`[?#]{${group}}([.?]|$)`);
    let match = regex.exec(newMap);
    while (match) {
      const nextBlock = newMap.indexOf("#");
      const isValid = nextBlock === -1 || nextBlock >= match.index;
      if (!isValid) return valid;
      // If regex match, add it to valid and move the map forward 1. If match started with # then its over
      valid.push(newMap.slice(match.index + group + 1));
      if (match[0].startsWith("#")) {
        return valid;
      }
      newMap = newMap.slice(match.index + 1);
      match = regex.exec(newMap);
    }
    return valid;
  }

  private getNumberOfMaps(map: string, groups: number[]): number {
    // Keep track of valid maps, run the group of numbers over the valid maps
    let validMaps = [map];
    groups.forEach((group) => {
      validMaps = validMaps.flatMap((valid) => this.getAllValid(valid, group));
    });
    return validMaps.filter((v) => !v.includes("#")).length;
  }

  solvePart1(input: string[]): number {
    return input.reduce((prev, line) => {
      const [map, groupString] = line.split(" ");
      const groups = groupString.split(",").map((v) => +v);
      const total = this.getNumberOfMaps(map, groups);
      return prev + total;
    }, 0);
  }

  private getPossibleArrangements(map: string, groups: number[]): number {
    // Create a state map of the groups
    const stateMap = `${groups.map((g) => `.${"#".repeat(g)}`).join("")}.`;
    // An initial state (Starts with 1 valid path)
    let state: { [key: number]: number } = { 0: 1 };
    let newState: { [key: number]: number } = {};
    const increment = (key: number) => {
      newState[key + 1] = (newState[key + 1] || 0) + state[key];
    };
    for (const char of map) {
      // For each character in the map we check all the state we are currently on,
      // If the character + any of the states can make a new valid state in the stateMap, we add it to the new state
      for (const key in state) {
        const currentState = +key;
        switch (char) {
          case ".":
            if (stateMap[currentState] === ".") {
              newState[currentState] =
                (newState[currentState] || 0) + state[currentState];
            }
            if (stateMap[currentState + 1] === ".") {
              increment(currentState);
            }
            break;
          case "#":
            if (stateMap[currentState + 1] === "#") {
              increment(currentState);
            }
            break;
          case "?":
            if (stateMap[currentState] === ".") {
              newState[currentState] =
                (newState[currentState] || 0) + state[currentState];
            }
            if (currentState < stateMap.length - 1) {
              increment(currentState);
            }
            break;
        }
      }
      state = newState;
      newState = {};
    }
    return (
      (state[stateMap.length - 1] || 0) + (state[stateMap.length - 2] || 0)
    );
  }

  solvePart2(input: string[]): number {
    return input.reduce((prev, line) => {
      const [smallMap, groupString] = line.split(" ");
      const smallGroups = groupString.split(",").map((v) => +v);
      const map = `${smallMap}${`?${smallMap}`.repeat(4)}`;
      const groups = Array.from({ length: 5 }).flatMap(() => smallGroups);
      const total = this.getPossibleArrangements(map, groups);
      return prev + total;
    }, 0);
  }
}

module.exports = new Day12Solution();

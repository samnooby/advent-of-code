import { Day } from "../day";

type NumberMap = {
  destination: number;
  source: number;
  range: number;
};

type NumberMaps = {
  [key: string]: NumberMap[];
};

type SeedRange = {
  start: number;
  range: number;
};

class Day5Solution extends Day {
  dayNumber = 5;
  expectedTestValues = { part1: 35, part2: 46 };

  solvePart1(input: string[]) {
    // Get the seeds
    const seeds = this.getSeeds(input[0]);
    const maps = this.getMaps(input);
    let min: number | null = null;
    for (const seed of seeds) {
      let mappedSeed = seed;
      for (const seedMaps of Object.values(maps)) {
        let oldSeed = mappedSeed;
        for (const seedMap of seedMaps) {
          if (oldSeed === mappedSeed) {
            mappedSeed = this.mapNumber(mappedSeed, seedMap);
          }
        }
      }
      if (!min || mappedSeed < min) min = mappedSeed;
    }
    if (!min) throw Error("No min found");
    return min;
  }

  solvePart2(input: string[]) {
    let seedRanges = this.getSeedRanges(input[0]);
    const numberMaps = this.getMaps(input);
    for (const [key, maps] of Object.entries(numberMaps)) {
      let leftoverSeeds = seedRanges;
      let mappedSeeds: SeedRange[] = [];
      for (const map of maps) {
        let remainder: SeedRange[] = [];
        for (const seed of leftoverSeeds) {
          const { mapped, leftover } = this.getMappedRanges(seed, map);
          if (leftover) remainder = [...remainder, leftover];
          if (mapped) mappedSeeds = [...mappedSeeds, mapped];
        }
        leftoverSeeds = remainder;
      }
      seedRanges = [...leftoverSeeds, ...mappedSeeds];
    }
    const starts = seedRanges.map((s) => s.start);
    return Math.min(...starts);
  }

  // Gets all the seed numbers from the given string
  private getSeeds(input: string): number[] {
    const seedRegex = /\d+/g;
    return Array.from(input.matchAll(seedRegex)).map((v) => +v[0]);
  }

  // Gets the difference ranges for a given map (destination source range)
  private getRanges(input: string): NumberMap {
    const mapRegex = /(?<destination>\d+) (?<source>\d+) (?<range>\d+)/g;
    const matches = input.matchAll(mapRegex);
    // Only returns the first match
    for (const match of matches) {
      if (!match.groups) throw Error("No groups found");
      const { destination, source, range } = match.groups;
      return {
        destination: +destination,
        source: +source,
        range: +range,
      };
    }
    throw Error("No match found");
  }

  // Maps the number to the next number using the map
  private mapNumber(val: number, map: NumberMap): number {
    if (map.source <= val && val <= map.source + map.range) {
      return val + (map.destination - map.source);
    }
    return val;
  }

  private getMaps(input: string[]): NumberMaps {
    let currentKey = "";
    const maps: NumberMaps = input.reduce((prev: NumberMaps, curr, i) => {
      if (curr.length === 0 || curr.startsWith("seeds:")) return prev;
      if (curr.endsWith("map:")) {
        currentKey = curr;
        return prev;
      }
      const val = currentKey in prev ? prev[currentKey] : [];
      return { ...prev, [currentKey]: [...val, this.getRanges(curr)] };
    }, {});
    return maps;
  }

  private getSeedRanges(input: string): SeedRange[] {
    let seeds: SeedRange[] = [];
    const seedRegex = /\d+ \d+/g;
    for (const match of input.matchAll(seedRegex)) {
      const [start, range] = match[0].split(" ").map((v) => +v);
      const newRange: SeedRange = { start, range };
      seeds = [...seeds, newRange];
    }
    return seeds;
  }

  private getMappedRanges(
    range: SeedRange,
    map: NumberMap
  ): { mapped: SeedRange | null; leftover: SeedRange | null } {
    // If no intersection just return all as unmapped
    if (
      range.start + range.range < map.source ||
      range.start > map.source + map.range
    ) {
      return { mapped: null, leftover: range };
    }
    // If full intersection, map and return
    if (
      map.source <= range.start &&
      map.source + map.range >= range.start + range.range
    ) {
      const difference = map.destination - map.source;
      return {
        mapped: {
          range: range.range,
          start: range.start + difference,
        },
        leftover: null,
      };
    }
    // If range intersects into map
    if (range.start < map.source) {
      const newRange = map.source - range.start;
      const difference = map.destination - map.source;
      return {
        mapped: {
          start: map.source + difference,
          range: range.range - newRange,
        },
        leftover: { start: range.start, range: newRange },
      };
    }
    const difference = map.destination - map.source;
    const mapTop = map.source + map.range;
    const rangeTop = range.start + range.range;
    const topDifference = rangeTop - mapTop;
    return {
      mapped: {
        start: range.start + difference,
        range: range.range - topDifference,
      },
      leftover: { start: rangeTop, range: topDifference },
    };
  }
}

module.exports = new Day5Solution();

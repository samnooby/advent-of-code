import { existsSync, writeFileSync, mkdirSync } from "fs";
import { Day } from "./day";

const getDayTemplate = (dayNumber: number) => {
  return `import { Day } from "../day";

  class Day${dayNumber}Solution extends Day {
    expectedTestValues = { part1: 0, part2: 0 };
  
    solvePart1(input: string[]): number {
      return 1;
    }
  
    solvePart2(input: string[]): number {
      return 1;
    }
  }
  
  module.exports = new Day${dayNumber}Solution();`;
};

// makeFileIfNotExists creates filename with given data if no file exists (Does not overwrite)
const makeFileIfNotExists = (fileName: string, data: string = "") => {
  if (!existsSync(fileName)) {
    writeFileSync(fileName, data);
    console.log(`Created file: ${fileName}`);
  }
};

/**
 * Creates a day directory and files for the specified day number if they don't exist.
 * The day directory will be located at './days/day${dayNumber}'.
 * The function generates a TypeScript template file and creates blank input and test files.
 *
 * @param dayNumber - The number of the day to create.
 * @returns The imported module for the created day.
 */
export const createDay = (dayNumber: number): Day<any, any> => {
  const dirName = `./days/day${dayNumber}`;
  if (!existsSync(dirName)) {
    mkdirSync(dirName);
    console.log(`Create dir: ${dirName}`);
  }
  makeFileIfNotExists(
    `${dirName}/day${dayNumber}.ts`,
    getDayTemplate(dayNumber)
  );
  makeFileIfNotExists(`${dirName}/input.txt`);
  makeFileIfNotExists(`${dirName}/test.txt`);
  return require(`./day${dayNumber}/day${dayNumber}.ts`);
};

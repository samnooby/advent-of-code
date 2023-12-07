import { Day } from "./day";
import * as readline from "readline";
import { readdirSync } from "fs";

const getDays = (): { [key: number]: Day<any, any> } => {
  const regex = /^day(\d+).ts$/;
  const files = readdirSync("./days", { recursive: true, withFileTypes: true });
  const foundDays: { [key: number]: Day<any, any> } = files.reduce(
    (prev, file) => {
      const dayNumber = regex.exec(file.name)?.at(1);
      if (!dayNumber) {
        return prev;
      }
      const day: Day<any, any> = require(`${file.path.replace("days/", "./")}/${
        file.name
      }`);
      return { ...prev, [+dayNumber]: day };
    },
    {}
  );
  if (Object.keys(foundDays).length === 0) {
    throw Error("No days found");
  }

  return foundDays;
};

const days: { [key: number]: Day<any, any> } = getDays();
const dayNumbers = Object.keys(days).map((key) => +key);

/**
 * Converts an array of numbers into a string of ranges.
 * For example, [1, 2, 3, 4, 5, 7, 8, 9] will be converted to "1-5, 7-9".
 *
 * @param numbers - An array of numbers to be converted into ranges.
 * @returns A string representation of the ranges.
 */
const getRanges = (numbers: number[]): string => {
  const condensedRange: string[] = numbers
    .sort((a, b) => a - b)
    .reduce((prev: string[], curr, i, arr) => {
      const last = prev.at(-1);
      if (arr[i - 1] === curr - 1 && arr[i + 1] === curr + 1) {
        return last?.endsWith("-")
          ? prev
          : prev.slice(0, -1).concat(`${last}-`);
      }
      return last?.endsWith("-")
        ? prev.slice(0, -1).concat(`${last}${curr}`)
        : [...prev, `${curr}`];
    }, []);

  return condensedRange.join(", ");
};

/**
 * Prompts the user to enter a day number or specific input and returns a promise that resolves
 * with a key-value pair of day numbers and day objects.
 * If no input is provided, the promise resolves with the latest day object
 * If a valid day number is provided, the promise resolves with the corresponding day object.
 * If 'a' or 'all' is provided, the promise resolves with all day objects.
 *
 * @param label - The label describing the purpose of the user input.
 * @returns A promise that resolves to a key-value pair of day numbers and day objects.
 */
export const getDayFromUserInput = (
  label: String
): Promise<{ [key: number]: Day<any, any> }> => {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true,
  });
  return rl
    .question(
      `Leave blank for latest, 'a' or 'all' for all or a number in ${getRanges(
        dayNumbers
      )}\nEnter day you want to ${label}: `
    )
    .then((answer) => {
      if (!answer) {
        const latestDay = Math.max(...dayNumbers);
        return { [latestDay]: days[latestDay] };
      }
      if (!isNaN(+answer)) {
        if (!(+answer in days)) {
          console.error(`Day ${answer} does not exist`);
          return {};
        }
        return { [+answer]: days[+answer] };
      }
      if (["a", "all"].includes(answer.toLowerCase())) {
        return days;
      }
      console.error("Invalid input");
      return {};
    })
    .finally(() => rl.close());
};

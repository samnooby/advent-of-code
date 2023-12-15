import { Day } from "./day";
import { readdirSync } from "fs";
import { createDay } from "./dayCreator";
import { createInterface } from "readline/promises";
import { settings } from "../settings";

/**
 * Imports all day files that follow the pattern './days/day${dayNumber}/day${dayNumber}.ts'
 * and creates an object with dayNumber as the key and the imported file as the value.
 *
 * @returns An object containing all imported day files, with dayNumber as the key.
 */
const getDays = (): { [key: number]: string } => {
  const regex = /^day(\d+).ts$/;
  const files = readdirSync("./days", { recursive: true, withFileTypes: true });
  const foundDays: { [key: number]: string } = files.reduce((prev, file) => {
    const dayNumber = regex.exec(file.name)?.at(1);
    if (!dayNumber || file.path !== `days/day${dayNumber}`) {
      return prev;
    }
    return {
      ...prev,
      [+dayNumber]: `${file.path.replace("days/", "./")}/${file.name}`,
    };
  }, {});

  return foundDays;
};

const days: { [key: number]: string } = getDays();
//If the current date is between December 1 and December 25, and the day doesn't already exist, create it
const month = new Date().getMonth();
const date = new Date().getDate();
if (!days[date] && month === 11 && date <= 25) days[date] = createDay(date);

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
      if (["a", "all"].includes(answer.toLowerCase())) {
        return Object.entries(days).reduce((prev, [key, value]) => {
          const day = require(value);
          return { ...prev, [+key]: day };
        }, {});
      }
      // Set dayInput to default
      let dayInput: number =
        settings.defaultDay === "L"
          ? Math.max(...dayNumbers)
          : settings.defaultDay;
      if (answer) {
        if (isNaN(+answer))
          console.log(
            "\x1B[31m%s\x1B[0m",
            `\nInvalid input: ${answer}, using default`
          );
        else dayInput = +answer;
      }
      if (!(dayInput in days)) {
        console.error(
          "\x1B[31m%s\x1B[0m",
          "\x1B[31%s\x1B[34m",
          `\nDay ${answer} does not exist`
        );
        return {};
      }
      const day = require(days[dayInput]);
      return { [dayInput]: day };
    })
    .finally(() => rl.close());
};

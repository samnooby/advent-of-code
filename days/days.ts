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

const getRanges = (range: number[]): string => {
  const condensedRange: string[] = range
    .sort((a, b) => a - b)
    .reduce((prev: string[], curr, i, arr) => {
      if (arr[i - 1] === curr - 1 && arr[i + 1] === curr + 1) {
        const last = prev.at(-1);
        return last?.endsWith("-")
          ? prev
          : prev.slice(0, -1).concat(`${last}-`);
      }
      const last = prev.at(-1);
      return last?.endsWith("-")
        ? prev.slice(0, -1).concat(`${last}${curr}`)
        : [...prev, `${curr}`];
    }, []);

  return condensedRange.join(", ");
};

export const getDayFromUserInput = (
  label: String,
  callback: (day: Day<any>) => void
) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question(
    `Leave blank for latest, 'a' or 'all' for all or a number in ${getRanges(
      dayNumbers
    )}\nEnter day you want to ${label}: `,
    (answer) => {
      if (!answer) {
        // If no answer callback with the latest day
        const latestDay = Math.max(...dayNumbers);
        callback(days[latestDay]);
      } else if (!isNaN(+answer)) {
        // If a number is given test that day, make sure the day exists
        if (!(+answer in days)) {
          console.error(`Day ${answer} does not exist`);
          return;
        }
        callback(days[+answer]);
      } else if (["a", "all"].includes(answer.toLowerCase())) {
        // If 'a' or 'all' is given test all days
        Object.values(days).forEach(callback);
      } else {
        console.error("Invalid input");
      }
      rl.close();
    }
  );
};

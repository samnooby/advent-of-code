import { day1 } from "./src/day1";
import * as readline from "readline";

export type Day = (input: String[]) => String;

export const days: Day[] = [];

export const runDay = (
  label: String,
  callback: (day: number, dayFunc: Day) => void
) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question(
    `What day do you want to ${label}? (1-${days.length})\n`,
    (answer) => {
      if (!answer) {
        // If no answer callback with the latest day
        const dayFunc = days.at(-1);
        if (dayFunc) {
          callback(days.length, dayFunc);
        }
      } else if (!isNaN(+answer)) {
        // If a number is given test that day, make sure the day exists
        const day = +answer;
        if (day > 0 && day <= days.length) {
          callback(day, days[day - 1]);
        } else {
          console.error(`Day ${day} does not exist`);
        }
      } else if (["a", "all"].includes(answer.toLowerCase())) {
        // If 'a' or 'all' is given test all days
        days.forEach((dayFunc, i) => callback(i + 1, dayFunc));
      } else {
        console.error("Invalid input");
      }
      rl.close();
    }
  );
};

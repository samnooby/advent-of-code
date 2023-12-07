import { Day } from "./day";
import * as readline from "readline";
import { readdirSync } from "fs";

const getDays = (): Day<any, any>[] => {
  const regex = /day\d+.ts/;
  const files = readdirSync("./days", { recursive: true, withFileTypes: true });
  const foundDays: Day<any, any>[] = files
    .filter((file) => {
      return file.isFile() && regex.test(file.name);
    })
    .map((file) => require(`${file.path.replace("days/", "./")}/${file.name}`));
  if (foundDays.length === 0) {
    throw Error("No days found");
  }
  return foundDays;
};

const days: Day<any, any>[] = getDays();

export const getDayFromUserInput = (
  label: String,
  callback: (day: Day<any>) => void
) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question(
    `What day do you want to ${label}? (1-${days.length}, 'a' for all or blank for latest)\n`,
    (answer) => {
      if (!answer) {
        // If no answer callback with the latest day
        const foundDay = days.at(-1);
        if (foundDay) {
          callback(foundDay);
        }
      } else if (!isNaN(+answer)) {
        // If a number is given test that day, make sure the day exists
        const day = +answer;
        if (day > 0 && day <= days.length) {
          callback(days[day - 1]);
        } else {
          console.error(`Day ${day} does not exist`);
        }
      } else if (["a", "all"].includes(answer.toLowerCase())) {
        // If 'a' or 'all' is given test all days
        days.forEach((day) => callback(day));
      } else {
        console.error("Invalid input");
      }
      rl.close();
    }
  );
};

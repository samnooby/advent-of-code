import { Day } from "./day";
import * as readline from "readline";
import { Day2 } from "./day2/day2";
import { Day1 } from "./day1/day1";
import { Day3 } from "./day3/day3";
import { Day4 } from "./day4/day4";
import { Day5 } from "./day5/day5";

export const days: Day[] = [Day1, Day2, Day3, Day4, Day5];

export const getDayFromUserInput = (
  label: String,
  callback: (day: Day) => void
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

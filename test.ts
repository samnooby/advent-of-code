import { Day, TestResult } from "./days/day";
import { getDayFromUserInput } from "./days/days";

const testDay = (day: Day) => {
  console.log(`\nDay ${day.dayNumber} tests:`);
  console.table(day.test());
};

getDayFromUserInput("test", testDay);

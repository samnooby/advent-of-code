import { Day } from "./days/day";
import { getDayFromUserInput } from "./days/days";

const runDay = (day: Day) => {
  console.log(`\nDay ${day.dayNumber} solutions:`);
  console.table(day.run());
};

getDayFromUserInput("solve", runDay);

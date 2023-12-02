import { Day } from "./days/day";
import { getDayFromUserInput } from "./days/days";

const runDay = (day: Day) => {
  console.log(`\nDay ${day.dayNumber} solutions:`);
  const solutions: { [key: string]: string } = {};
  day.run().forEach((solution, index) => {
    solutions[`Part ${index + 1}`] = solution;
  });
  console.table(solutions);
};

getDayFromUserInput("solve", runDay);

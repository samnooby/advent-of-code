import { Day } from "./day";
import { getDayFromUserInput } from "./days";

const runDay = (day: Day) => {
  console.log(`Day ${day.dayNumber} solutions:`);
  const solutions: { [key: string]: string } = {};
  day.run().forEach((solution, index) => {
    solutions[`Part ${index + 1}`] = solution;
  });
  console.table(solutions);
};

getDayFromUserInput("solve", runDay);

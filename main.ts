import { Day } from "./day";
import { getDayFromUserInput } from "./days";

const runDay = (day: Day) => {
  console.log(`Day ${day.dayNumber} solutions:`);
  day.run().forEach((solution, index) => {
    console.log(`Part ${index + 1}: ${solution}`);
  });
};

getDayFromUserInput("solve", runDay);

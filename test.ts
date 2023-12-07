import { getDayFromUserInput } from "./days/days";

getDayFromUserInput("test").then((days) => {
  Object.entries(days).forEach(([dayNumber, day]) => {
    console.log(`\nDay ${dayNumber} Test Results:`);
    console.table(day.test(+dayNumber));
  });
});

import { getDayFromUserInput } from "./days/days";

getDayFromUserInput("solve").then((days) => {
  const solutions = Object.entries(days).reduce((prev, [dayNumber, day]) => {
    return { ...prev, [dayNumber]: day.run(+dayNumber) };
  }, {});
  console.table(solutions);
});

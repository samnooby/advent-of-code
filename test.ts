import { getDayFromUserInput } from "./days/days";

getDayFromUserInput("test").then(async (days) => {
  const solutions = await Promise.all(
    Object.entries(days).map(([dayNumber, day]) => day.test(+dayNumber))
  );
  solutions.forEach(({ dayNumber, part1, part2 }) => {
    console.log(`\nDay ${dayNumber} Test Results:`);
    console.table({ part1, part2 });
  });
});

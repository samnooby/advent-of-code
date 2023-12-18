import { getDayFromUserInput } from "./days/days";

getDayFromUserInput("solve").then(async (days) => {
  const solutions = await Promise.all(
    Object.entries(days).map(([dayNumber, day]) => day.run(+dayNumber))
  );
  solutions.forEach(({ dayNumber, part1, part2 }) => {
    console.log(`\nDay ${dayNumber} Results:`);
    console.table({ part1, part2 });
  });
});

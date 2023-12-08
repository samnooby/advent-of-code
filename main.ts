import { getDayFromUserInput } from "./days/days";

getDayFromUserInput("solve").then(async (days) => {
  const solutions = await Promise.all(
    Object.entries(days).map(([dayNumber, day]) => day.run(+dayNumber))
  );
  console.table(
    solutions.reduce((prev, { dayNumber, part1, part2 }) => {
      return {
        ...prev,
        [dayNumber]: { part1, part2 },
      };
    }, {})
  );
});

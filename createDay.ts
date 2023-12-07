import { createInterface } from "readline/promises";
import { createDay } from "./days/dayCreator";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
});

rl.question("Enter a day to create (1-25): ")
  .then((answer) => {
    const dayNumber = +answer;
    if (!isNaN(dayNumber) && dayNumber >= 1 && dayNumber <= 25) {
      createDay(dayNumber);
      return;
    }
    console.error("Invalid input");
  })
  .finally(() => rl.close());

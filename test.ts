import { Day } from "./day";
import { getDayFromUserInput } from "./days";

const testDay = (day: Day) => {
  console.log(`Day ${day.dayNumber} tests:`);
  day.test().forEach((test, index) => {
    console.log(`Test ${index + 1}: ${test.passed ? "Passed" : "Failed"}`);
    console.log(
      `Got: ${test.value} ${test.passed ? "" : `Expected: ${test.expected}`}`
    );
  });
};

getDayFromUserInput("test", testDay);

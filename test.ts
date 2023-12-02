import { Day, TestResult } from "./days/day";
import { getDayFromUserInput } from "./days/days";

const testDay = (day: Day) => {
  console.log(`\nDay ${day.dayNumber} tests:`);
  const tests: { [key: string]: TestResult } = {};
  day.test().forEach((test, index) => {
    tests[`Part ${index + 1}`] = test;
  });
  console.table(tests);
};

getDayFromUserInput("test", testDay);

import { Day, TestResult } from "./day";
import { getDayFromUserInput } from "./days";

const testDay = (day: Day) => {
  console.log(`\nDay ${day.dayNumber} tests:`);
  const tests: { [key: string]: TestResult } = {};
  day.test().forEach((test, index) => {
    tests[`Part ${index + 1}`] = test;
  });
  console.table(tests);
};

getDayFromUserInput("test", testDay);

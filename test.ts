import * as fs from "fs";
import { Day, runDay } from "./days";

const testDay = (day: number, dayFunc: Day) => {
  const input = fs.readFileSync(`./tests/day${day}.txt`).toString().split("\n");
  const expected = fs.readFileSync(`./tests/answers/day${day}.txt`).toString();
  const actual = dayFunc(input);
  console.log(`Day ${day}: ${actual === expected ? "PASS" : "FAIL"}`);
  console.log(`Got answer: ${actual}, expected: ${expected}`);
};

runDay("test", testDay);

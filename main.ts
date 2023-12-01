import * as fs from "fs";
import { Day, runDay } from "./days";

const solveDay = (day: number, dayFunc: Day) => {
  console.log(`Solving Day ${day}`);
  const input = fs
    .readFileSync(`./inputs/day${day}.txt`)
    .toString()
    .split("\n");
  console.log(`Got answer: ${dayFunc(input)}`);
};

runDay("solve", solveDay);

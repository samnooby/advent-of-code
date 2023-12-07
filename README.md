# Advent of Code 2023

Created by Sam Newby

## Installation and Setup

Clone this repo and run `npm i` from to install the required packages. To see my solutions checkout to the `master` branch, to write your own solutions checkout the `blank` branch

## Running existing code

In the main directory run `npx ts-node test.ts ` to run the tests and `npx ts-node main.ts` to run the input. Once either file is run you will be shown a list of available days and asked which day you want to run. Inputting a day number will run the corresponding day, 'a' or 'all' will run all of the available days and leaving the input blank will run the latest days solution.

## Writing your own solutions

### Creating day solution template

If you are writing your solutions while Advent of Code is active running `test.ts` or `main.ts` will create a template for the current day if it does not currently exist. To manually create a template solution run `npx ts-node createDay.ts` and input the day you wish to create (Will not overwrite existing days). All solutions must be in `days/day${dayNumber}/day${dayNumber}.ts` file otherwise it will not be read.

### Writing code

Your solutions should be written in the `solvePart1` and `solvePart2` functions, these function will receive a list of each line of the input file and should return the solution given the input.

### Using different input and test files

To use different test or input files overwrite the `testFiles` or `inputFiles` property in your solution. The files must be in the same directory or within sub directories of the typescript file.

### Changing solution return types

The Day abstract class can take 2 generic types for different solution return types, by default `Part 2 return type = Part 1 return type = number`

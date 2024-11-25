import test from "node:test";
import { loadProgram } from "./utils";
import { Day, Program } from "./types";

export async function testsFor(day: Day, fn: (day: Day, implementation: Program) => void): Promise<void> {
  await loadProgram(day).then((implementation) => {
    fn(day, implementation);
  });
}

export function cases<Input, Output>([year, day]: Day, definitions: [Input, Output][], fn: (input: Input, output: Output) => void) {
  let index = 1;
  for (const [input, output] of definitions) {
    test(`${year}-${day} - test #${index}`, async () => {
      await fn(input, output);
    });
    index++;
  }
}

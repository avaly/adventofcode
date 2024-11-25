export type Day = [string, string];

export type Program<Input = string[], Output = number> = {
  part1: (input: Input) => Output;
  part2: (input: Input) => Output;
}

function parse(input: string[]): number[] {
  const data: number[] = [];

  for (const line of input) {
    const a = parseInt(line, 10);
    data.push(a);
  }

  return data;
}

export function part1(input: string[]): number {
  let result = 0;

  const data = parse(input);

  return result;
}

export function part2(input: string[]): number {
  let result = 0;

  const data = parse(input);

  return result;
}

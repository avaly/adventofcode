function parse(input: string[]): [number[], number[]] {
  const list1: number[] = [];
  const list2: number[] = [];

  for (const line of input) {
    const [a, b] = line.split(/\s+/).map(Number);
    list1.push(a);
    list2.push(b);
  }

  return [list1, list2];
}

export function part1(input: string[]): number {
  let result = 0;
  const [list1, list2] = parse(input);

  list1.sort();
  list2.sort();

  for (let i = 0; i < list1.length; i++) {
    result += Math.abs(list1[i] - list2[i]);
  }

  return result;
}

export function part2(input: string[]): number {
  let result = 0;
  const [list1, list2] = parse(input);

  const occurrences: Record<number, number> = {};

  for (const value of list2) {
    occurrences[value] = occurrences[value] ? occurrences[value] + 1 : 1;
  }

  for (let i = 0; i < list1.length; i++) {
    result += list1[i] * (occurrences[list1[i]] || 0);
  }

  return result;
}

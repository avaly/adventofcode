function parse(input: string[], part2: boolean = false): number {
	return parseInt(input[0], 10);
}

export function part1(input: string[]): number {
	// https://en.wikipedia.org/wiki/Josephus_problem
	const size = parse(input);

	return 1 + 2 * (size ^ (1 << Math.floor(Math.log2(size))));
}

export function part2(input: string[]): number {
	const size = parse(input);
	const pow = Math.pow(3, size.toString(3).length - 1);

	if (pow === size) {
		return pow;
	} else if (pow >= size / 2) {
		return size - pow;
	}
	return pow + 2 * (size - 2 * pow);
}

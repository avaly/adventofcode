type Data = unknown;

function parse(input: string[], part2: boolean = false): Data {
	const data: number[] = [];

	for (const line of input) {
		const a = parseInt(line, 10);
		data.push(a);
	}

	return data;
}

function solve(data: Data, part2: boolean = false): number {
	return 0;
}

export function part1(input: string[]): number {
	return solve(parse(input));
}

export function part2(input: string[]): number {
	return solve(parse(input, true), true);
}

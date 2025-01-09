type Triangle = [number, number, number];
type Data = Triangle[];

function parse(input: string[], part2: boolean = false): Data {
	const data: Triangle[] = [];

	if (part2) {
		for (let i = 0; i < input.length; i += 3) {
			const group = input
				.slice(i, i + 3)
				.map((line) => line.trim().split(/\s+/).map(Number) as Triangle);

			for (let j = 0; j < 3; j++) {
				data.push(group.map((item) => item[j]) as Triangle);
			}
		}
	} else {
		for (const line of input) {
			data.push(line.trim().split(/\s+/).map(Number) as Triangle);
		}
	}

	return data;
}

function isValid([a, b, c]: Triangle): boolean {
	return a + b > c && a + c > b && b + c > a;
}

function solve(data: Data): number {
	return data.filter((item) => isValid(item)).length;
}

export function part1(input: string[]): number {
	return solve(parse(input));
}

export function part2(input: string[]): number {
	return solve(parse(input, true));
}

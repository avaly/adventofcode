type Operation = [number, number, boolean];

function parse(input: string[]): Operation[] {
	const data: Operation[] = [];

	let enabled = true;
	for (const line of input) {
		const operations = line.matchAll(/(do(n't)?\(\)|mul\((\d{1,3}),(\d{1,3})\))/g);
		for (const match of operations) {
			const [, , dont, a, b] = match;
			if (a && b) {
				data.push([parseInt(a, 10), parseInt(b, 10), enabled]);
			} else {
				enabled = !dont;
			}
		}
	}

	return data;
}

export function part1(input: string[]): number {
	const data = parse(input);

	return data.reduce((acc, [a, b]) => acc + a * b, 0);
}

export function part2(input: string[]): number {
	const data = parse(input);

	return data.reduce((acc, [a, b, enabled]) => acc + (enabled ? a * b : 0), 0);
}

type Disc = {
	size: number;
	start: number;
};
type Data = Disc[];

function parse(input: string[], part2: boolean = false): Data {
	const data: Disc[] = [];

	for (const line of input) {
		const match = /Disc #\d+ has (\d+) positions; at time=0, it is at position (\d+)./.exec(line);
		if (match) {
			data.push({
				size: parseInt(match[1], 10),
				start: parseInt(match[2], 10),
			});
		}
	}

	if (part2) {
		data.push({
			size: 11,
			start: 0,
		});
	}

	return data;
}

function solve(data: Data): number {
	for (let time = 0; time < 100_000_000; time++) {
		if (data.every((disc, index) => (time + index + 1 + disc.start) % disc.size === 0)) {
			return time;
		}
	}

	return 0;
}

export function part1(input: string[]): number {
	return solve(parse(input));
}

export function part2(input: string[]): number {
	return solve(parse(input, true));
}

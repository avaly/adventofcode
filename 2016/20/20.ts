type Range = [number, number];
type Data = Range[];

const MAX = 4294967295;

function parse(input: string[]): Data {
	const data: Data = [];

	for (const line of input) {
		data.push(line.split('-').map((value) => parseInt(value, 10)) as Range);
	}

	return data;
}

function getGoodRanges(data: Data): Data {
	const result: Data = [[0, MAX]];

	for (const [blockedStart, blockedEnd] of data) {
		for (let i = result.length - 1; i >= 0; i--) {
			const [start, end] = result[i];

			if (blockedEnd < start || blockedStart > end) {
				continue;
			}

			if (blockedStart <= start && blockedEnd >= end) {
				result.splice(i, 1);
			} else if (blockedStart <= start) {
				result[i][0] = blockedEnd + 1;
			} else if (blockedEnd >= end) {
				result[i][1] = blockedStart - 1;
			} else {
				result[i][1] = blockedStart - 1;
				result.splice(i + 1, 0, [blockedEnd + 1, end]);
			}
		}
	}

	return result;
}

export function part1(input: string[]): number {
	const good = getGoodRanges(parse(input));

	return good[0][0];
}

export function part2(input: string[]): number {
	const good = getGoodRanges(parse(input));

	return good.reduce((acc, range) => acc + range[1] - range[0] + 1, 0);
}

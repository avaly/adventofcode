import type { MoveLetter } from '../../utils/types.ts';

type Data = [MoveLetter, number][];

function parse(input: string[], part2: boolean = false): Data {
	const data: Data = [];

	for (const line of input) {
		const value = parseInt(line.substring(1), 10);
		data.push([line.substring(0, 1) as MoveLetter, value]);
	}

	return data;
}

function solve(data: Data, part2: boolean = false): number {
	let current = 50;
	let previous = current;
	let result = 0;

	for (const [move, value] of data) {
		const remainder = value % 100;

		switch (move) {
			case 'L':
				current = current - remainder;
				if (current < 0) {
					current += 100;

					// Add the extra crossing if we crossed zero
					if (part2 && previous > 0) {
						result++;
					}
				}
				break;
			case 'R':
				current = (current + remainder) % 100;

				// Add the extra crossing if we crossed zero
				if (part2 && remainder > 100 - previous) {
					result++;
				}
				break;
		}

		previous = current;

		if (current === 0) {
			result++;
		}
		// Add all the hundreds
		if (part2) {
			result += Math.floor(value / 100);
		}
	}

	return result;
}

export function part1(input: string[]): number {
	return solve(parse(input));
}

export function part2(input: string[]): number {
	return solve(parse(input, true), true);
}

import { md5 } from '../../utils/utils';

type Data = string;

function parse(input: string[]): Data {
	return input[0];
}

function compute(
	data: Data,
	range: [number, number],
	indexes: Map<number, string>,
	sequences: Map<string, number[]>,
	part2: boolean = false,
): string | undefined {
	let result;

	for (let index = range[0]; index <= range[1]; index++) {
		let hash = md5(`${data}${index}`);

		if (part2) {
			for (let i = 0; i < 2016; i++) {
				hash = md5(hash);
			}
		}

		const matchTriplet = /(.)\1\1/.exec(hash);
		if (matchTriplet) {
			const id = matchTriplet[0];
			indexes.set(index, id);
			sequences.set(id, [...(sequences.get(id) || []), index]);
			if (!result) {
				result = id;
			}
		}

		const matchPentuplet = /(.)\1\1\1\1/.exec(hash);
		if (matchPentuplet) {
			const id = matchPentuplet[0];
			sequences.set(id, [...(sequences.get(id) || []), index]);
		}
	}

	return result;
}

function solve(data: Data, part2: boolean = false): number {
	let index = 0;
	let computed = 0;
	const sequences = new Map<string, number[]>();
	const indexes = new Map<number, string>();
	const keys = [];

	while (keys.length < 64) {
		const triplet = compute(data, [index, index], indexes, sequences, part2);
		computed = Math.max(index, computed);

		if (triplet) {
			compute(data, [Math.max(index + 1, computed + 1), index + 1_000], indexes, sequences, part2);
			computed = index + 1_000;

			const pentuplet = triplet.repeat(2).substring(0, 5);
			if (
				sequences.has(pentuplet) &&
				sequences.get(pentuplet).find((value) => value >= index + 1 && value <= index + 1_000)
			) {
				keys.push(index);
			}

			const indexesWithTriplets = [...indexes.keys()];
			const thisIndex = indexesWithTriplets.findIndex((value) => value === index);
			if (thisIndex > -1 && thisIndex < indexesWithTriplets.length - 1) {
				index = indexesWithTriplets[thisIndex + 1] - 1;
			}
		}

		index++;
	}

	return keys[keys.length - 1];
}

export function part1(input: string[]): number {
	return solve(parse(input));
}

export function part2(input: string[]): number {
	return solve(parse(input), true);
}

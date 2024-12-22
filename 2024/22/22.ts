function parse(input: string[]): number[] {
	const data: number[] = [];

	for (const line of input) {
		const a = parseInt(line, 10);
		data.push(a);
	}

	return data;
}

// JS supports 64-bit numbers, but does bit operations on 32-bit numbers only
// https://stackoverflow.com/questions/72624005/bitwise-xor-in-javascript-with-a-64-bit-integer
function xor(v1: number, v2: number): number {
	var hi = 0x80000000;
	var low = 0x7fffffff;
	var hi1 = ~~(v1 / hi);
	var hi2 = ~~(v2 / hi);
	var low1 = v1 & low;
	var low2 = v2 & low;
	var h = hi1 ^ hi2;
	var l = low1 ^ low2;

	return h * hi + l;
}

function mixPrune(value: number, other: number): number {
	return xor(value, other) % 16777216;
}

function generate(value: number, iterations: number): number[] {
	let result = [value];

	let current = value;
	for (let i = 0; i < iterations; i++) {
		current = mixPrune(current, current * 64);
		current = mixPrune(current, Math.floor(current / 32));
		current = mixPrune(current, current * 2048);
		result.push(current);
	}

	return result;
}

export function part1(input: string[]): number {
	const data = parse(input);

	return data
		.map((value) => generate(value, 2000))
		.reduce((acc, values) => acc + values[values.length - 1], 0);
}

export function part2(input: string[]): number {
	let result = 0;

	const data = parse(input);

	const seqCost = new Map<string, number>();

	for (const number of data) {
		const numbers = generate(number, 2000);
		const prices = numbers.map((value) => value % 10);
		const diffs = prices.slice(1).map((price, index) => price - prices[index]);
		const visited = new Set();

		for (let i = 4; i < diffs.length; i++) {
			const seq = diffs.slice(i - 4, i).join(',');

			if (visited.has(seq)) {
				continue;
			}
			visited.add(seq);

			const cost = seqCost.get(seq) || 0;
			const newCost = cost + prices[i];

			seqCost.set(seq, newCost);

			if (newCost > result) {
				result = newCost;
			}
		}
	}

	return result;
}

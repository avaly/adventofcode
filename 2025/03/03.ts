type Bank = number[];
type Data = Bank[];

function parse(input: string[], part2: boolean = false): Data {
	const data: Data = [];

	for (const line of input) {
		data.push(line.split('').map((d) => parseInt(d, 10)));
	}

	return data;
}

function findMaxFor(bank: Bank, flips: number, selected: number[]): number {
	const size = bank.length;

	const search = bank.slice(0, size - flips + 1);
	const maxDigit = Math.max(...search);
	const indexes = search
		.map((value, index) => (value === maxDigit ? index : -1))
		.filter((i) => i >= 0);

	const nextSelected = [...selected, maxDigit];

	let localMax = 0;

	for (const startIndex of indexes) {
		const nextBank = bank.slice(startIndex + 1);

		if (nextBank.length > 0 && flips > 1) {
			const nextMax = findMaxFor(nextBank, flips - 1, nextSelected);
			if (nextMax > localMax) {
				localMax = nextMax;
			}
		} else {
			const candidate = parseInt(nextSelected.join(''), 10);
			if (candidate > localMax) {
				localMax = candidate;
			}
		}
	}

	return localMax;
}

function solve(data: Data, part2: boolean = false): number {
	return data.reduce((acc, bank) => acc + findMaxFor(bank, part2 ? 12 : 2, []), 0);
}

export function part1(input: string[]): number {
	return solve(parse(input));
}

export function part2(input: string[]): number {
	return solve(parse(input, true), true);
}

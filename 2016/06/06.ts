type Data = string[];

function solve(data: Data, part2: boolean = false): string {
	const size = data[0].length;
	const letters = Array.from('x'.repeat(size)).map(() => new Map<string, number>());

	for (const word of data) {
		for (let c = 0; c < size; c++) {
			const letter = word[c];
			letters[c].set(letter, (letters[c].get(letter) || 0) + 1);
		}
	}

	return letters
		.map((counts) => {
			const pairs = [...counts.entries()];
			pairs.sort((a, b) => b[1] - a[1]);
			return pairs[part2 ? pairs.length - 1 : 0][0];
		})
		.join('');
}

export function part1(input: string[]): string {
	return solve(input);
}

export function part2(input: string[]): string {
	return solve(input, true);
}

export function* generateAllCombinations<T>(
	items: T[],
	counts: [number, number],
	selected: number[] = [],
): IterableIterator<T[]> {
	if (selected.length >= counts[0] && selected.length <= counts[1]) {
		yield selected.map((index) => items[index]);
		if (selected.length === counts[1]) {
			return;
		}
	}

	for (let i = 0; i < items.length; i++) {
		let valid = !selected.includes(i);

		if (valid) {
			yield* generateAllCombinations(items, counts, [...selected, i]);
		}
	}
}

export function* generateUniqueCombinations<T>(
	items: T[],
	counts: [number, number],
	selected: number[] = [],
): IterableIterator<T[]> {
	if (selected.length >= counts[0] && selected.length <= counts[1]) {
		yield selected.map((index) => items[index]);
		if (selected.length === counts[1]) {
			return;
		}
	}

	let max = Math.max(...selected, 0);

	for (let i = max; i < items.length; i++) {
		let valid = !selected.includes(i);

		if (valid) {
			yield* generateUniqueCombinations(items, counts, [...selected, i]);
		}
	}
}

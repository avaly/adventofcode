export function* generateAllCombinations<T>(
	items: T[],
	count: number,
	selected: number[] = [],
): IterableIterator<T[]> {
	if (selected.length === count) {
		yield selected.map((index) => items[index]);
		return;
	}

	for (let i = 0; i < items.length; i++) {
		let valid = !selected.includes(i);

		if (valid) {
			yield* generateAllCombinations(items, count, [...selected, i]);
		}
	}
}

export function* generateUniqueCombinations<T>(
	items: T[],
	count: number,
	selected: number[] = [],
): IterableIterator<T[]> {
	// console.log('selected', selected, count);

	if (selected.length === count) {
		yield selected.map((index) => items[index]);
		return;
	}

	let max = Math.max(...selected, 0);
	// console.log('max', max);

	for (let i = max; i < items.length; i++) {
		let valid = !selected.includes(i);

		if (valid) {
			yield* generateUniqueCombinations(items, count, [...selected, i]);
		}
	}
}

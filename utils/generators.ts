export function* generateAllCombinations<T>(
	items: T[],
	counts: [number, number],
	selected: number[] = [],
	isValid?: (partial: T[], candidate: T) => boolean,
): IterableIterator<T[]> {
	if (selected.length >= counts[0] && selected.length <= counts[1]) {
		yield selected.map((index) => items[index]);
		if (selected.length === counts[1]) {
			return;
		}
	}

	for (let i = 0; i < items.length; i++) {
		if (
			!selected.includes(i) &&
			(!isValid ||
				isValid(
					selected.map((index) => items[index]),
					items[i],
				))
		) {
			yield* generateAllCombinations(items, counts, [...selected, i], isValid);
		}
	}
}

export function* generateUniqueCombinations<T>(
	items: T[],
	counts: [number, number],
	selected: number[] = [],
	isValid?: (partial: T[], candidate: T) => boolean,
): IterableIterator<T[]> {
	if (selected.length >= counts[0] && selected.length <= counts[1]) {
		yield selected.map((index) => items[index]);
		if (selected.length === counts[1]) {
			return;
		}
	}

	let max = Math.max(...selected, 0);

	for (let i = max; i < items.length; i++) {
		if (
			!selected.includes(i) &&
			(!isValid ||
				isValid(
					selected.map((index) => items[index]),
					items[i],
				))
		) {
			yield* generateUniqueCombinations(items, counts, [...selected, i], isValid);
		}
	}
}

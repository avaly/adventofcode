type Range = [number, number];
type Data = {
	fresh: Range[];
	ingredients: number[];
};

function parse(input: string[], part2: boolean = false): Data {
	const data: Data = {
		fresh: [],
		ingredients: [],
	};

	let onIngredients = false;
	for (const line of input) {
		if (!line.length) {
			onIngredients = true;
			continue;
		}

		if (onIngredients) {
			data.ingredients.push(parseInt(line, 10));
		} else {
			const parts = line.split('-');
			data.fresh.push([parseInt(parts[0], 10), parseInt(parts[1], 10)]);
		}
	}

	return data;
}

function isFresh(ingredient: number, fresh: Range[]): boolean {
	for (const [start, end] of fresh) {
		if (ingredient >= start && ingredient <= end) {
			return true;
		}
	}
	return false;
}

function areIntersecting(range1: Range, range2: Range): boolean {
	const maxStart = Math.max(range1[0], range2[0]);
	const minEnd = Math.min(range1[1], range2[1]);

	return maxStart <= minEnd;
}

export function part1(input: string[]): number {
	const data = parse(input);

	return data.ingredients.reduce((acc, ingredient) => {
		return acc + (isFresh(ingredient, data.fresh) ? 1 : 0);
	}, 0);
}

export function part2(input: string[]): number {
	const data = parse(input);
	let result = 0;

	data.fresh.sort((a, b) => a[0] - b[0]);

	const starts = data.fresh.map(([start]) => start);
	const ends = data.fresh.map(([, end]) => end + 1);

	const points = [...new Set([...starts, ...ends])];

	points.sort((a, b) => a - b);

	for (let i = 0; i < points.length - 1; i++) {
		const start = points[i];
		const end = points[i + 1];

		if (data.fresh.some((range) => areIntersecting(range, [start, end - 1]))) {
			result += end - start;
		}
	}

	return result;
}

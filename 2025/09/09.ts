import Coords from '../../utils/Coords.ts';
import { generateUniqueCombinations } from '../../utils/generators.ts';

type Data = Coords[];

function parse(input: string[]): Data {
	const data: Data = [];

	for (const line of input) {
		data.push(Coords.from(line.split(',').map((v) => parseInt(v, 10)) as [number, number]));
	}

	return data;
}

function solve(data: Data, part2: boolean = false): number {
	let max = 0;

	const indexes = data.map((_, i) => i);
	const rectangles: [Coords, Coords, number][] = [];

	for (const [indexA, indexB] of generateUniqueCombinations(indexes, [2, 2])) {
		const tileA = data[indexA];
		const tileB = data[indexB];

		const area = (Math.abs(tileA.x - tileB.x) + 1) * (Math.abs(tileA.y - tileB.y) + 1);
		rectangles.push([tileA, tileB, area]);

		if (area > max) {
			max = area;
		}
	}

	if (!part2) {
		return max;
	}

	rectangles.sort((a, b) => b[2] - a[2]);

	for (const [tileA, tileB, area] of rectangles) {
		let ok = true;

		for (let i = 0; i < data.length; i++) {
			const point1 = data[i];
			const point2 = data[(i + 1) % data.length];

			// All edges in the full polygon must be:
			// - left point of edge must be left of this rect OR
			// - right point of edge must be right of this rect OR
			// - top point of edge must be above this rect OR
			// - bottom point of edge must be below this rect
			const beforeX = Math.max(tileA.x, tileB.x) <= Math.min(point1.x, point2.x);
			const afterX = Math.min(tileA.x, tileB.x) >= Math.max(point1.x, point2.x);
			const beforeY = Math.max(tileA.y, tileB.y) <= Math.min(point1.y, point2.y);
			const afterY = Math.min(tileA.y, tileB.y) >= Math.max(point1.y, point2.y);

			if (!beforeX && !afterX && !beforeY && !afterY) {
				ok = false;
				break;
			}
		}

		if (ok) {
			return area;
		}
	}
}

export function part1(input: string[]): number {
	return solve(parse(input));
}

export function part2(input: string[]): number {
	return solve(parse(input), true);
}

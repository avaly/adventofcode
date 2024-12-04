import { Coords2D, Matrix, Vector2D } from '../../utils/types';
import { negativeVector } from '../../utils/utils';

const NEEDLE1 = 'XMAS'.split('');
const NEEDLE2 = 'MAS'.split('');

const DIRECTIONS1: Vector2D[] = [
	[-1, -1],
	[0, -1],
	[1, -1],
	[-1, 0],
	[1, 0],
	[-1, 1],
	[0, 1],
	[1, 1],
];
const DIRECTIONS2: Vector2D[] = [
	[-1, -1],
	[1, -1],
	[-1, 1],
	[1, 1],
];

function parse(input: string[]): Matrix<string> {
	const result: Matrix<string> = [];

	for (const line of input) {
		result.push(line.split(''));
	}

	return result;
}

function findAt(
	matrix: Matrix<string>,
	needle: string[],
	[x, y]: Coords2D,
	[dx, dy]: Vector2D,
	seen?: Set<string>,
): boolean {
	if (matrix[y][x] !== needle[0]) {
		return false;
	}

	let xx = x + dx;
	let yy = y + dy;

	let i = 1;

	while (xx >= 0 && xx < matrix[0].length && yy >= 0 && yy < matrix.length) {
		if (matrix[yy][xx] !== needle[i]) {
			break;
		}

		if (i === needle.length - 1) {
			return seen ? !seen.has(encode([x, y], [dx, dy])) : true;
		}

		i++;
		xx += dx;
		yy += dy;
	}

	return false;
}

function count1At(matrix: Matrix<string>, coordinates: Coords2D): number {
	let result = 0;

	for (const direction of DIRECTIONS1) {
		result += findAt(matrix, NEEDLE1, coordinates, direction) ? 1 : 0;
	}

	return result;
}

export function part1(input: string[]): number {
	let result = 0;

	const data = parse(input);

	for (let y = 0; y < data.length; y++) {
		for (let x = 0; x < data[y].length; x++) {
			const count = count1At(data, [x, y]);
			result += count;
		}
	}

	return result;
}

function encode(coordinates: Coords2D, direction: Vector2D): string {
	return `${coordinates.join('x')} -> ${direction.join('x')}`;
}

function count2At(matrix: Matrix<string>, [x, y]: Coords2D, seen: Set<string>): number {
	let result = 0;

	for (const [dx, dy] of DIRECTIONS2) {
		// Check both diagonals
		if (
			findAt(matrix, NEEDLE2, [x, y], [dx, dy], seen) &&
			findAt(matrix, NEEDLE2, [x + dx * 2, y], [negativeVector(dx), dy], seen)
		) {
			result += 1;
			seen.add(encode([x, y], [dx, dy]));
			seen.add(encode([x + dx * 2, y], [negativeVector(dx), dy]));
		} else if (
			findAt(matrix, NEEDLE2, [x, y], [dx, dy], seen) &&
			findAt(matrix, NEEDLE2, [x, y + dy * 2], [dx, negativeVector(dy)], seen)
		) {
			result += 1;
			seen.add(encode([x, y], [dx, dy]));
			seen.add(encode([x, y + dy * 2], [dx, negativeVector(dy)]));
		}
	}

	return result;
}

export function part2(input: string[]): number {
	let result = 0;

	const seen = new Set<string>();

	const data = parse(input);

	for (let y = 0; y < data.length; y++) {
		for (let x = 0; x < data[y].length; x++) {
			result += count2At(data, [x, y], seen);
		}
	}

	return result;
}

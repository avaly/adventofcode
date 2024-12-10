import { Orientations, OrientationVector2D } from '../../utils/constants';
import Matrix from '../../utils/Matrix';
import { Coords2D } from '../../utils/types';
import { addPositionVector2D } from '../../utils/utils';

function parse(input: string[]): Matrix<number> {
	return Matrix.toNumberMatrix(input, '', (value) => {
		return value === '.' ? -1 : parseInt(value, 10);
	});
}

function walk(map: Matrix<number>, scores: Matrix<number>, start: Coords2D, allPaths: boolean) {
	let height = map.get(start);

	scores.set(start, allPaths ? scores.get(start) + 1 : 1);

	for (const orientation of Orientations) {
		const next = addPositionVector2D(start, OrientationVector2D[orientation]);

		if (map.inBounds(next) && height > 0 && map.get(next) === height - 1) {
			walk(map, scores, next, allPaths);
		}
	}
}

function solve(map: Matrix<number>, allPaths: boolean): number {
	const scores = Matrix.initialize(map.sizeX, map.sizeY, 0);

	for (const { position, value } of map) {
		if (value === 9) {
			const localScores = Matrix.initialize(map.sizeX, map.sizeY, 0);

			walk(map, localScores, position, allPaths);

			scores.combineMatrix(localScores, (a, b) => a + b);
		}
	}

	let result = 0;

	for (const { position, value } of map) {
		if (value === 0) {
			result += scores.get(position);
		}
	}

	return result;
}

export function part1(input: string[]): number {
	const map = parse(input);

	return solve(map, false);
}

export function part2(input: string[]): number {
	const map = parse(input);

	return solve(map, true);
}

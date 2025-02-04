import Coords from '../../utils/Coords';
import Matrix, { WALL } from '../../utils/Matrix';

type Data = {
	finish: Coords;
	map: Matrix<number>;
	size: number;
	start: Coords;
};

function parse(input: string[]): Data {
	const size = parseInt(input[0], 10);

	return {
		finish: Coords.from(input[1].split(',').map(Number) as [number, number]),
		map: Matrix.initialize(size, size, 0),
		size,
		start: Coords.from([1, 1]),
	};
}

export function isWall(pos: Coords, special: number): boolean {
	const { x, y } = pos;

	// Find x*x + 3*x + 2*x*y + y + y*y.
	// Add the office designer's favorite number (your puzzle input).
	let value = x * x + 3 * x + 2 * x * y + y + y * y + special;

	// Find the binary representation of that sum; count the number of bits that are 1.
	let bits = 0;
	while (value > 0) {
		if ((value & 1) === 1) {
			bits++;
		}
		value = value >> 1;
	}

	// If the number of bits that are 1 is even, it's an open space.
	// If the number of bits that are 1 is odd, it's a wall.
	return bits % 2 === 1;
}

function solve(data: Data, part2: boolean = false): number {
	const { finish, map, size, start } = data;

	for (const { coords } of map) {
		map.set(coords, isWall(coords, size) ? WALL : 0);
	}

	Matrix.shortestPaths(map, start);

	if (!part2) {
		return map.get(finish) - 1;
	}

	let result = 0;

	for (const { value } of map) {
		if (value !== WALL && value > 0 && value <= 51) {
			result++;
		}
	}

	return result;
}

export function part1(input: string[]): number {
	return solve(parse(input));
}

export function part2(input: string[]): number {
	return solve(parse(input), true);
}

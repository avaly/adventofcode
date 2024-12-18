import { ORIENTATIONS, OrientationVector2D } from '../../utils/constants';
import Coords from '../../utils/Coords';
import Matrix from '../../utils/Matrix';

type Data = {
	bytes: Coords[];
	map: Matrix<number>;
};

const WALL = 999_999;

function parse(input: string[]): Data {
	const [size, first] = input[0].split(' ').map(Number);

	const bytes: Coords[] = [];
	const map = Matrix.initialize(size, size, Number.MAX_SAFE_INTEGER);

	for (const line of input.slice(1, first + 1)) {
		const [x, y] = line.split(',').map(Number);
		map.setRaw(x, y, WALL);
	}
	for (const line of input.slice(first + 1)) {
		bytes.push(Coords.from(line.split(',').map(Number) as [number, number]));
	}

	return { bytes, map };
}

function findPath(map: Matrix<number>, end: Coords, current: Coords, cost: number) {
	if (!map.inBounds(current) || map.get(current) === WALL) {
		return;
	}

	if (current.x === 0 && current.y === 0) {
		map.set(current, WALL);
	} else {
		map.set(current, cost);
	}

	for (const orientation of ORIENTATIONS) {
		const neighbor = Coords.add(current, OrientationVector2D[orientation]);

		if (!map.inBounds(neighbor)) {
			continue;
		}

		const neighborValue = map.get(neighbor);
		if (neighborValue === WALL) {
			continue;
		}
		if (neighborValue > 0 && neighborValue <= cost + 1) {
			continue;
		}

		findPath(map, end, neighbor, cost + 1);
	}
}

function findShortestPath(map: Matrix<number>): number {
	const start = Coords.from([0, 0]);
	const end = Coords.from([map.sizeX - 1, map.sizeY - 1]);

	findPath(map, end, start, 0);

	return map.get(end);
}

export function part1(input: string[]): number {
	const { map } = parse(input);

	return findShortestPath(map);
}

export function part2(input: string[]): string {
	const { bytes, map } = parse(input);

	while (bytes.length) {
		const byte = bytes.shift();

		map.set(byte, WALL);

		const cost = findShortestPath(Matrix.clone(map));
		if (cost === Number.MAX_SAFE_INTEGER) {
			return `${byte.x},${byte.y}`;
		}
	}

	return '';
}

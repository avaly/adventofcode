import { OrientationRight, OrientationVector2D } from '../../utils/constants';
import Matrix from '../../utils/Matrix';
import { Coords2D, Orientation } from '../../utils/types';
import { addCoordsVector2D } from '../../utils/utils';

type Guard = {
	orientation: Orientation;
	position: Coords2D;
};

const ORIENTATION_BITS = {
	north: 0,
	east: 1,
	south: 2,
	west: 3,
};
const WALL = 99;

function parse(input: string[]): [Matrix<number>, Guard] {
	let guard: Guard = {
		orientation: 'north',
		position: [-1, -1],
	};

	const map = Matrix.toNumberMatrix(input, '', (value: string, position: Coords2D) => {
		if (value === '^') {
			guard.position = position;
		}
		return value === '#' ? WALL : 0;
	});

	return [map, guard];
}

function walkGuard(map: Matrix<number>, guard: Guard) {
	const { sizeX, sizeY } = map;
	let { orientation, position } = guard;
	let vector = OrientationVector2D[orientation];

	do {
		map.set(position, 1);

		const newPos = addCoordsVector2D(position, vector);

		if (newPos[0] < 0 || newPos[0] >= sizeX || newPos[1] < 0 || newPos[1] >= sizeY) {
			break;
		}

		if (map.get(newPos) !== WALL) {
			position = newPos;
		} else if (map.get(newPos) === WALL) {
			orientation = OrientationRight[orientation];
			vector = OrientationVector2D[orientation];
		}
	} while (true);
}

function checkObstacle(map: Matrix<number>, obstacle: Coords2D, guard: Guard): boolean {
	const { sizeX, sizeY } = map;

	if (obstacle[0] < 0 || obstacle[0] >= sizeX || obstacle[1] < 0 || obstacle[1] >= sizeY) {
		return false;
	}
	if (map.get(obstacle) !== 0) {
		return false;
	}

	map.set(obstacle, WALL);

	let { orientation, position } = guard;
	orientation = OrientationRight[orientation];
	let orientationValue = 1 << ORIENTATION_BITS[orientation];
	let vector = OrientationVector2D[orientation];

	do {
		if ((map.get(position) & orientationValue) !== 0) {
			return true;
		}

		map.set(position, map.get(position) | orientationValue);

		const newPos = addCoordsVector2D(position, vector);
		if (newPos[0] < 0 || newPos[0] >= sizeX || newPos[1] < 0 || newPos[1] >= sizeY) {
			break;
		}

		if (map.get(newPos) !== WALL) {
			position = newPos;
		} else if (map.get(newPos) === WALL) {
			orientation = OrientationRight[orientation];
			orientationValue = 1 << ORIENTATION_BITS[orientation];
			vector = OrientationVector2D[orientation];
		}
	} while (true);

	return false;
}

function findObstacles(map: Matrix<number>, guard: Guard): number {
	const { sizeX, sizeY } = map;

	let { orientation, position } = guard;
	let orientationValue = 1 << ORIENTATION_BITS[orientation];
	let vector = OrientationVector2D[orientation];
	let obstacles = 0;

	do {
		map.set(position, map.get(position) | orientationValue);

		if (
			checkObstacle(Matrix.clone(map), addCoordsVector2D(position, vector), {
				orientation,
				position,
			})
		) {
			obstacles++;
		}

		const newPos = addCoordsVector2D(position, vector);
		if (newPos[0] < 0 || newPos[0] >= sizeX || newPos[1] < 0 || newPos[1] >= sizeY) {
			break;
		}

		if (map.get(newPos) !== WALL) {
			position = newPos;
			map.set(position, map.get(position) | orientationValue);
		} else if (map.get(newPos) === WALL) {
			orientation = OrientationRight[orientation];
			orientationValue = 1 << ORIENTATION_BITS[orientation];
			vector = OrientationVector2D[orientation];
		}
	} while (true);

	return obstacles;
}

export function part1(input: string[]): number {
	const [map, guard] = parse(input);

	walkGuard(map, guard);

	return map.data.reduce(
		(acc, line) => acc + line.reduce((acc, value) => acc + (value === 1 ? 1 : 0), 0),
		0,
	);
}

export function part2(input: string[]): number {
	const [map, guard] = parse(input);

	return findObstacles(map, guard);
}

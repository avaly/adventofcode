import { OrientationRight, OrientationVector2D } from '../../utils/constants';
import { Coords2D, Matrix, Orientation } from '../../utils/types';
import { addPositionVector2D, readNumberMatrix } from '../../utils/utils';

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

	const map = readNumberMatrix(input, '', (value: string, position: Coords2D) => {
		if (value === '^') {
			guard.position = position;
		}
		return value === '#' ? WALL : 0;
	});

	return [map, guard];
}

function walkGuard(map: Matrix<number>, guard: Guard) {
	let { orientation, position } = guard;
	let vector = OrientationVector2D[orientation];
	let sizeX = map[0].length;
	let sizeY = map.length;

	do {
		map[position[1]][position[0]] = 1;

		const newPos = addPositionVector2D(position, vector);

		if (newPos[0] < 0 || newPos[0] >= sizeX || newPos[1] < 0 || newPos[1] >= sizeY) {
			break;
		}

		if (map[newPos[1]][newPos[0]] !== WALL) {
			position = newPos;
		} else if (map[newPos[1]][newPos[0]] === WALL) {
			orientation = OrientationRight[orientation];
			vector = OrientationVector2D[orientation];
		}
	} while (true);
}

function checkObstacle(map: Matrix<number>, obstacle: Coords2D, guard: Guard): boolean {
	let sizeX = map[0].length;
	let sizeY = map.length;

	if (obstacle[0] < 0 || obstacle[0] >= sizeX || obstacle[1] < 0 || obstacle[1] >= sizeY) {
		return false;
	}
	if (map[obstacle[1]][obstacle[0]] !== 0) {
		return false;
	}

	map[obstacle[1]][obstacle[0]] = WALL;

	let { orientation, position } = guard;
	orientation = OrientationRight[orientation];
	let orientationValue = 1 << ORIENTATION_BITS[orientation];
	let vector = OrientationVector2D[orientation];

	do {
		if ((map[position[1]][position[0]] & orientationValue) !== 0) {
			return true;
		}

		map[position[1]][position[0]] |= orientationValue;

		const newPos = addPositionVector2D(position, vector);
		if (newPos[0] < 0 || newPos[0] >= sizeX || newPos[1] < 0 || newPos[1] >= sizeY) {
			break;
		}

		if (map[newPos[1]][newPos[0]] !== WALL) {
			position = newPos;
		} else if (map[newPos[1]][newPos[0]] === WALL) {
			orientation = OrientationRight[orientation];
			orientationValue = 1 << ORIENTATION_BITS[orientation];
			vector = OrientationVector2D[orientation];
		}
	} while (true);

	return false;
}

function findObstacles(map: Matrix<number>, guard: Guard): number {
	let { orientation, position } = guard;
	let orientationValue = 1 << ORIENTATION_BITS[orientation];
	let vector = OrientationVector2D[orientation];
	let sizeX = map[0].length;
	let sizeY = map.length;
	let obstacles = 0;

	do {
		map[position[1]][position[0]] |= orientationValue;

		if (
			checkObstacle(JSON.parse(JSON.stringify(map)), addPositionVector2D(position, vector), {
				orientation,
				position,
			})
		) {
			obstacles++;
		}

		const newPos = addPositionVector2D(position, vector);
		if (newPos[0] < 0 || newPos[0] >= sizeX || newPos[1] < 0 || newPos[1] >= sizeY) {
			break;
		}

		if (map[newPos[1]][newPos[0]] !== WALL) {
			position = newPos;
			map[position[1]][position[0]] |= orientationValue;
		} else if (map[newPos[1]][newPos[0]] === WALL) {
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

	return map.reduce(
		(acc, line) => acc + line.reduce((acc, value) => acc + (value === 1 ? 1 : 0), 0),
		0,
	);
}

export function part2(input: string[]): number {
	const [map, guard] = parse(input);

	// 478 too low
	// 1756 too high
	// 1795 too high
	return findObstacles(map, guard);
}

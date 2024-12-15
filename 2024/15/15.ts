import { MoveVector2D } from '../../utils/constants';
import Matrix from '../../utils/Matrix';
import { Coords2D, Vector2D } from '../../utils/types';
import { addCoordsVector2D } from '../../utils/utils';

type Input = {
	map: Matrix<string>;
	moves: Vector2D[];
	robot: Coords2D;
};

function parse(input: string[]): Input {
	const [inputMap, inputMoves] = input.join('\n').split('\n\n');

	let robot: Coords2D;
	const map = Matrix.toStringMatrix(inputMap.split('\n'));

	for (const { position, value } of map) {
		if (value === '@') {
			robot = position;
		}
	}

	const moves: Vector2D[] = inputMoves
		.replace(/\n/g, '')
		.split('')
		.map((char) => MoveVector2D[char]);

	return { map, moves, robot };
}

function parse2(input: Input): Input {
	let { robot } = input;

	const map = Matrix.initialize(input.map.sizeX * 2, input.map.sizeY, '.');

	for (const { position, value } of input.map) {
		if (value === '#') {
			map.setRaw(position[0] * 2, position[1], '#');
			map.setRaw(position[0] * 2 + 1, position[1], '#');
		} else if (value === 'O') {
			map.setRaw(position[0] * 2, position[1], '[');
			map.setRaw(position[0] * 2 + 1, position[1], ']');
		}
		if (value === '@') {
			map.setRaw(position[0] * 2, position[1], '@');
			robot[0] *= 2;
		}
	}

	return {
		...input,
		map,
		robot,
	};
}

function moveRobot1(map: Matrix<string>, robot: Coords2D, move: Vector2D): Coords2D {
	const nextRobot = addCoordsVector2D(robot, move);

	let next = nextRobot;

	while (map.inBounds(next) && map.get(next) !== '#') {
		if (map.get(next) === '.') {
			break;
		}
		next = addCoordsVector2D(next, move);
	}

	if (map.get(next) === '#') {
		return robot;
	}

	// move boxes
	next = nextRobot;
	while (map.inBounds(next) && map.get(next) === 'O') {
		next = addCoordsVector2D(next, move);
	}
	if ((next[0] !== nextRobot[0] || next[1] !== nextRobot[1]) && map.inBounds(next)) {
		map.set(next, 'O');
	}

	map.set(robot, '.');
	map.set(nextRobot, '@');

	return nextRobot;
}

function canMove(map: Matrix<string>, position: Coords2D, move: Vector2D): boolean {
	const next = addCoordsVector2D(position, move);
	const nextCell = map.get(next);

	if (nextCell === '.') {
		return true;
	}
	if (nextCell === '#') {
		return false;
	}

	const box: Coords2D = nextCell === '[' ? next : [next[0] - 1, next[1]];

	// Horizontal move
	if (move[1] === 0) {
		return canMove(map, move[0] === -1 ? box : [box[0] + 1, box[1]], move);
	}

	// Vertical move
	const nextBox = addCoordsVector2D(box, move);
	const nextBoxEnd = [nextBox[0] + 1, nextBox[1]] as Coords2D;
	const nextStart = map.get(nextBox);
	const nextEnd = map.get(nextBoxEnd);

	return (
		(nextStart === '.' ||
			(nextStart !== '#' &&
				(nextStart === '['
					? canMove(map, nextBox, move) && canMove(map, nextBoxEnd, move)
					: canMove(map, [nextBox[0] - 1, nextBox[1]], move) && canMove(map, nextBox, move)))) &&
		(nextEnd === '.' ||
			(nextEnd !== '#' &&
				(nextEnd === '['
					? canMove(map, nextBoxEnd, move) && canMove(map, [nextBoxEnd[0] + 1, nextBoxEnd[1]], move)
					: canMove(map, nextBox, move) && canMove(map, nextBoxEnd, move))))
	);
}

function moveBox(map: Matrix<string>, box: Coords2D, move: Vector2D) {
	if (move[1] === 0) {
		// Horizontal move

		const next = addCoordsVector2D(box, move);
		const nextCheck = move[0] === -1 ? next : addCoordsVector2D(next, move);
		const nextCell = map.get(nextCheck);

		if (nextCell === '[' || nextCell === ']') {
			moveBox(map, nextCell === '[' ? nextCheck : [nextCheck[0] - 1, nextCheck[1]], move);
		}

		if (map.get(nextCheck) === '.') {
			map.set(box, '.');
			map.setRaw(box[0] + 1, box[1], '.');
			map.set(next, '[');
			map.setRaw(next[0] + 1, next[1], ']');
		}

		return;
	}

	// Vertical move
	const next = addCoordsVector2D(box, move);

	if (map.get(next) === '[' && map.getRaw(next[0] + 1, next[1]) === ']') {
		moveBox(map, next, move);
	}
	if (map.get(next) === ']') {
		moveBox(map, [next[0] - 1, next[1]], move);
	}
	if (map.getRaw(next[0] + 1, next[1]) === '[') {
		moveBox(map, [next[0] + 1, next[1]], move);
	}

	map.set(box, '.');
	map.setRaw(box[0] + 1, box[1], '.');
	map.set(next, '[');
	map.setRaw(next[0] + 1, next[1], ']');
}

function moveRobot2(map: Matrix<string>, robot: Coords2D, move: Vector2D): Coords2D {
	if (!canMove(map, robot, move)) {
		return robot;
	}

	const nextRobot = addCoordsVector2D(robot, move);

	if (map.get(nextRobot) === '.') {
		map.set(robot, '.');
		map.set(nextRobot, '@');

		return nextRobot;
	}

	const box: Coords2D = map.get(nextRobot) === '[' ? nextRobot : [nextRobot[0] - 1, nextRobot[1]];

	moveBox(map, box, move);

	map.set(robot, '.');
	map.set(nextRobot, '@');

	return nextRobot;
}

function gps(map: Matrix<string>): number {
	let result = 0;

	for (const { position, value } of map) {
		if (value === 'O') {
			result += position[0] + position[1] * 100;
		}
		if (value === '[') {
			result += position[0] + position[1] * 100;
		}
	}

	return result;
}

export function part1(input: string[]): number {
	const { map, moves, robot } = parse(input);

	let robotPos = robot;

	for (const move of moves) {
		robotPos = moveRobot1(map, robotPos, move);
	}

	return gps(map);
}

export function part2(input: string[]): number {
	const { map, moves, robot } = parse2(parse(input));

	let robotPos = robot;

	for (const move of moves) {
		robotPos = moveRobot2(map, robotPos, move);
	}

	return gps(map);
}

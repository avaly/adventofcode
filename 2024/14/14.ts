import { Coords2D } from '../../utils/types';
import { addCoords2D, wrapCoords2D } from '../../utils/utils';

type Robot = {
	position: Coords2D;
	vector: Coords2D;
};
type Quadrants = [[number, number], [number, number]];

function parse(input: string[]): [Coords2D, Robot[]] {
	const robots: Robot[] = [];

	const size = input[0].split(',').map(Number) as Coords2D;

	for (const line of input.slice(1)) {
		const match = /p=(\d+),(\d+) v=([-\d]+),([-\d]+)/.exec(line);

		robots.push({
			position: match.slice(1, 3).map(Number) as Coords2D,
			vector: match.slice(3, 5).map(Number) as Coords2D,
		});
	}

	return [size, robots];
}

function moveRobot(size: Coords2D, robot: Robot, moves: number): Coords2D {
	let current = robot.position;

	for (let m = 0; m < moves; m++) {
		current = wrapCoords2D(addCoords2D(current, robot.vector), size);
	}

	return current;
}

function getQuadrants(size: Coords2D, robots: Robot[]): Quadrants {
	const quadrants = [
		[0, 0],
		[0, 0],
	] as Quadrants;

	for (const { position } of robots) {
		if (position[0] === Math.floor(size[0] / 2) || position[1] === Math.floor(size[1] / 2)) {
			continue;
		}

		const x = Math.floor(position[0] / (size[0] / 2));
		const y = Math.floor(position[1] / (size[1] / 2));

		quadrants[y][x]++;
	}

	return quadrants;
}

function solve1(size: Coords2D, robots: Robot[], moves: number) {
	for (const robot of robots) {
		robot.position = moveRobot(size, robot, moves);
	}

	return getQuadrants(size, robots).reduce((acc, items) => acc * items[0] * items[1], 1);
}

function solve2(size: Coords2D, robots: Robot[]) {
	let move = 1;

	do {
		for (const robot of robots) {
			robot.position = moveRobot(size, robot, 1);
		}

		const quadrants = getQuadrants(size, robots);

		const avg = quadrants.reduce((acc, items) => acc + items[0] + items[1], 1) / 4;
		const compare = avg * 1.6;

		if (
			quadrants[0][0] > compare ||
			quadrants[0][1] > compare ||
			quadrants[1][0] > compare ||
			quadrants[1][1] > compare
		) {
			return move;
		}
	} while (move++);
}

export function part1(input: string[]): number {
	const [size, robots] = parse(input);

	return solve1(size, robots, 100);
}

export function part2(input: string[]): number {
	const [size, robots] = parse(input);

	return solve2(size, robots);
}

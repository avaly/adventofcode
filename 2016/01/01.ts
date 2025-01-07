import { OrientationLeft, OrientationRight, OrientationVector2D } from '../../utils/constants';
import Coords from '../../utils/Coords';
import { Orientation } from '../../utils/types';

type Step = ['L' | 'R', number];

function parse(input: string[]): Step[] {
	const data = [];

	for (const line of input) {
		const moves = line.split(', ');
		for (const move of moves) {
			data.push([move.charAt(0), parseInt(move.substring(1), 10)]);
		}
	}

	return data;
}

export function solve(input: string[], returnFirstVisited: boolean): Coords {
	const data = parse(input);

	let position = new Coords(0, 0);
	let orientation: Orientation = 'north';
	let visited = new Set<string>();

	for (const step of data) {
		orientation = step[0] === 'L' ? OrientationLeft[orientation] : OrientationRight[orientation];

		for (let i = 0; i < step[1]; i++) {
			position.add(OrientationVector2D[orientation]);

			if (visited.has(`${position}`) && returnFirstVisited) {
				return position;
			} else {
				visited.add(`${position}`);
			}
		}
	}

	return position;
}

export function part1(input: string[]): number {
	return solve(input, false).manhattanDistance;
}

export function part2(input: string[]): number {
	return solve(input, true).manhattanDistance;
}

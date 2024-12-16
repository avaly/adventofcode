import {
	ORIENTATION_BITS,
	OrientationLeft,
	OrientationRight,
	OrientationVector2D,
} from '../../utils/constants';
import Coords from '../../utils/Coords';
import Matrix from '../../utils/Matrix';
import { Orientation } from '../../utils/types';

type Input = {
	end: Coords;
	map: Matrix<number>;
	start: Coords;
};
type Output = {
	lowestScore: number;
	bestTiles: number;
};

const WALL = 99999;

let results: Record<string, Output> = {};

function parse(input: string[]): Input {
	let start;
	let end;

	const map = Matrix.toNumberMatrix(input, '', (value, position) => {
		if (value === 'S') {
			start = Coords.from(position);
		}
		if (value === 'E') {
			end = Coords.from(position);
		}
		return value === '#' ? WALL : 0;
	});

	return { end, map, start };
}

function solveDijkstra(map: Matrix<number>, start: Coords, end: Coords): Output {
	const queue: [Coords, Orientation, number, Set<string>][] = [
		[start, 'east', 0, new Set([`${start}`])],
	];
	const bestCost = [
		Matrix.initialize(map.sizeX, map.sizeY, 0),
		Matrix.initialize(map.sizeX, map.sizeY, 0),
		Matrix.initialize(map.sizeX, map.sizeY, 0),
		Matrix.initialize(map.sizeX, map.sizeY, 0),
	];
	let lowestScore = 999_999;
	let bestTiles = new Set<string>();

	while (queue.length) {
		const [current, orientation, score, path] = queue.shift();

		if (!map.inBounds(current) || map.get(current) === WALL) {
			continue;
		}

		if (current.equal(end)) {
			if (score < lowestScore) {
				lowestScore = score;
				bestTiles = new Set(path.values());
			} else if (score === lowestScore) {
				bestTiles = bestTiles.union(path);
			}
			continue;
		}

		const orientationIndex = ORIENTATION_BITS[orientation];
		if (
			bestCost[orientationIndex].get(current) > 0 &&
			bestCost[orientationIndex].get(current) < score
		) {
			continue;
		}
		bestCost[orientationIndex].set(current, score);

		// move front
		const next = Coords.add(current, OrientationVector2D[orientation]);
		if (map.inBounds(next) && map.get(next) !== WALL && !path.has(`${next}`)) {
			queue.push([next, orientation, score + 1, path.union(new Set([`${next}`]))]);
		}

		// rotate left
		const left = Coords.add(current, OrientationVector2D[OrientationLeft[orientation]]);
		if (map.inBounds(left) && map.get(left) !== WALL && !path.has(`${left}`)) {
			queue.push([current, OrientationLeft[orientation], score + 1000, path]);
		}

		// rotate right
		const right = Coords.add(current, OrientationVector2D[OrientationRight[orientation]]);
		if (map.inBounds(right) && map.get(right) !== WALL && !path.has(`${right}`)) {
			queue.push([current, OrientationRight[orientation], score + 1000, path]);
		}
	}

	return {
		lowestScore,
		bestTiles: bestTiles.size,
	};
}

function solve({ end, map, start }: Input): Output {
	const key = `${map.sizeX}-${map.sizeY} s:${start} e:${end} - ${map.data.map((line) => line.join('-')).join('_')}`;

	return (results[key] ||= solveDijkstra(map, start, end));
}

export function part1(input: string[]): number {
	return solve(parse(input)).lowestScore;
}

export function part2(input: string[]): number {
	return solve(parse(input)).bestTiles;
}

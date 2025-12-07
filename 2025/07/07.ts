import Coords from '../../utils/Coords.ts';
import Matrix from '../../utils/Matrix.ts';

type Data = {
	map: Matrix<string>;
	start: Coords;
};

function parse(input: string[], part2: boolean = false): Data {
	const map = Matrix.toStringMatrix(input);
	let start: Coords;

	for (const { coords, value } of map) {
		if (value === 'S') {
			start = coords;
		}
	}

	return { map, start };
}

export function part1(input: string[]): number {
	const { map, start } = parse(input);
	let splits = 0;

	for (let y = start.y + 1; y < map.sizeY; y++) {
		for (let x = 0; x < map.sizeX; x++) {
			if (['|', 'S'].includes(map.get([x, y - 1]))) {
				if (map.get([x, y]) === '^') {
					splits++;
					map.set([x - 1, y], '|');
					map.set([x + 1, y], '|');
				} else {
					map.set([x, y], '|');
				}
			}
		}
	}

	return splits;
}

let cache = new Map<string, number>();

function timelines(map: Matrix<string>, point: Coords): number {
	if (point.y === map.sizeY - 1) {
		return 1;
	}

	let pointStr = point.toString();

	if (cache.has(pointStr)) {
		return cache.get(pointStr);
	}

	let result = 0;

	if (map.get([point.x, point.y + 1]) === '^') {
		result = timelines(map, Coords.add(point, [-1, 1])) + timelines(map, Coords.add(point, [1, 1]));
	} else {
		result = timelines(map, Coords.add(point, [0, 1]));
	}

	cache.set(pointStr, result);

	return result;
}

export function part2(input: string[]): number {
	const { map, start } = parse(input);

	return timelines(map, start);
}

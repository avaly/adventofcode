import Coords from '../../utils/Coords';
import Matrix from '../../utils/Matrix';

type Data = {
	end: Coords;
	map: Matrix<number>;
	start: Coords;
};
type Cheat = [Coords, Coords, number];

const WALL = 999_999;

function parse(input: string[]): Data {
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

function findPath(data: Data) {
	const { map, start } = data;

	const queue: [Coords, number][] = [[start, 0]];

	while (queue.length) {
		const [current, cost] = queue.shift();

		if (!map.inBounds(current) || map.get(current) === WALL) {
			continue;
		}

		map.set(current, cost);

		for (const [neighbor] of current.neighborsDirect(map)) {
			if (neighbor.equal(start)) {
				continue;
			}

			const value = map.get(neighbor);
			if (value === WALL) {
				continue;
			}
			if (value > 0 && value <= cost + 1) {
				continue;
			}

			queue.push([neighbor, cost + 1]);
		}
	}
}

function findLongCheats(data: Data, start: Coords, maxLength: number): Cheat[] {
	const { map } = data;

	const cheats: Cheat[] = [];
	const queue: [Coords, number][] = [[start, 0]];

	const startCost = map.get(start);
	const visited = new Set<string>();

	while (queue.length) {
		const [current, length] = queue.shift();

		if (!map.inBounds(current)) {
			continue;
		}

		if (visited.has(`${current}`)) {
			continue;
		}
		visited.add(`${current}`);

		for (const [neighbor] of current.neighborsDirect(map)) {
			if (neighbor.equal(start)) {
				continue;
			}

			const value = map.get(neighbor);

			if (
				value !== WALL &&
				length > 0 &&
				length < maxLength &&
				value > startCost + length + 1 &&
				!cheats.find((item) => item[0].equal(start) && item[1].equal(neighbor))
			) {
				cheats.push([start, neighbor, value - startCost - length - 1]);
			}

			if (length < maxLength - 1 && !visited.has(`${neighbor}`)) {
				queue.push([neighbor, length + 1]);
			}
		}
	}

	return cheats;
}

function findAllCheats(data: Data, maxLength: number): number {
	const { map, start } = data;

	const cheats = new Set<string>();
	const queue: Coords[] = [start];

	while (queue.length) {
		const current = queue.shift();

		if (!map.inBounds(current) || map.get(current) === WALL) {
			return;
		}

		const currentCheats = findLongCheats(data, current, maxLength);
		for (const cheat of currentCheats) {
			if (cheat[2] >= 100 && !cheats.has(`${cheat[0]}-${cheat[1]}`)) {
				cheats.add(`${cheat[0]}-${cheat[1]}`);
			}
		}

		const currentCost = map.get(current);

		for (const [neighbor] of current.neighborsDirect(map)) {
			if (neighbor.equal(start)) {
				continue;
			}

			const value = map.get(neighbor);

			if (value !== WALL && map.get(neighbor) === currentCost + 1) {
				queue.push(neighbor);
			}
		}
	}

	return cheats.size;
}

export function part1(input: string[]): number {
	const data = parse(input);

	findPath(data);

	return findAllCheats(data, 2);
}

export function part2(input: string[]): number {
	const data = parse(input);

	findPath(data);

	return findAllCheats(data, 20);
}

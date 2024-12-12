import { ORIENTATION_BITS, ORIENTATIONS, OrientationVector2D } from '../../utils/constants';
import Matrix from '../../utils/Matrix';
import { Coords2D } from '../../utils/types';
import { addCoordsVector2D } from '../../utils/utils';

type Plot = {
	area: number;
	perimeter: number;
	sides: number;
	start: Coords2D;
};

function parse(input: string[]): Matrix<string> {
	return Matrix.toStringMatrix(input);
}

function fillID(map: Matrix<string>, start: Coords2D, id: string) {
	let plot = map.get(start);

	map.set(start, id);

	for (const orientation of ORIENTATIONS) {
		const neighbor = addCoordsVector2D(start, OrientationVector2D[orientation]);

		if (map.inBounds(neighbor) && map.get(neighbor) === plot) {
			fillID(map, neighbor, id);
		}
	}
}

function fillSides(map: Matrix<string>, sides: Matrix<number>, position: Coords2D) {
	let id = map.get(position);

	sides.set(position, 0);

	let positionSides = 0;

	for (const orientation of ORIENTATIONS) {
		const neighbor = addCoordsVector2D(position, OrientationVector2D[orientation]);

		if (!map.inBounds(neighbor) || map.get(neighbor) !== id) {
			positionSides += 1 << ORIENTATION_BITS[orientation];
		} else if (sides.get(neighbor) === -1) {
			fillSides(map, sides, neighbor);
		}
	}

	sides.set(position, positionSides);
}

function countSides(sides: Matrix<number>): number {
	let total = 0;

	for (const { position, value } of sides) {
		if (value === -1) {
			continue;
		}

		for (const orientation of ORIENTATIONS) {
			const side = 1 << ORIENTATION_BITS[orientation];
			if ((value & side) === 0) {
				continue;
			}

			total++;

			if (orientation === 'north' || orientation === 'south') {
				// clear side from east
				for (
					let x = position[0];
					x < sides.sizeX &&
					sides.getRaw(x, position[1]) > 0 &&
					(sides.getRaw(x, position[1]) & side) > 0;
					x++
				) {
					sides.setRaw(x, position[1], sides.getRaw(x, position[1]) & ~side);
				}
				// clear side from west
				for (
					let x = position[0] - 1;
					x >= 0 && sides.getRaw(x, position[1]) > 0 && (sides.getRaw(x, position[1]) & side) > 0;
					x--
				) {
					sides.setRaw(x, position[1], sides.getRaw(x, position[1]) & ~side);
				}
			}

			if (orientation === 'east' || orientation === 'west') {
				// clear side from south
				for (
					let y = position[1];
					y < sides.sizeY &&
					sides.getRaw(position[0], y) > 0 &&
					(sides.getRaw(position[0], y) & side) > 0;
					y++
				) {
					sides.setRaw(position[0], y, sides.getRaw(position[0], y) & ~side);
				}
				// clear side from north
				for (
					let y = position[1] - 1;
					y >= 0 && sides.getRaw(position[0], y) > 0 && (sides.getRaw(position[0], y) & side) > 0;
					y--
				) {
					sides.setRaw(position[0], y, sides.getRaw(position[0], y) & ~side);
				}
			}
		}
	}

	return total;
}

function solve(map: Matrix<string>): Plot[] {
	const duplicates = new Map<string, number>();
	const plots = new Map<string, Plot>();

	for (const { position, value } of map) {
		if (value.length === 1) {
			if (!duplicates.has(value)) {
				duplicates.set(value, 1);
			} else {
				duplicates.set(value, duplicates.get(value) + 1);
			}

			fillID(map, position, `${value}-${duplicates.get(value)}`);
		}
	}

	for (const { position, value } of map) {
		if (!plots.has(value)) {
			plots.set(value, {
				area: 0,
				perimeter: 0,
				sides: 0,
				start: position,
			});
		}

		const plot = plots.get(value);

		plot.area++;

		for (const orientation of ORIENTATIONS) {
			const neighbor = addCoordsVector2D(position, OrientationVector2D[orientation]);

			if (!map.inBounds(neighbor) || map.get(neighbor) !== value) {
				plot.perimeter++;
			}
		}
	}

	let sides: Matrix<number>;

	for (const id of plots.keys()) {
		sides = Matrix.initialize(map.sizeX, map.sizeY, -1);

		fillSides(map, sides, plots.get(id).start);

		plots.get(id).sides = countSides(sides);
	}

	return [...plots.values()];
}

export function part1(input: string[]): number {
	const map = parse(input);

	return solve(map).reduce((acc, plot) => acc + plot.area * plot.perimeter, 0);
}

export function part2(input: string[]): number {
	const map = parse(input);

	return solve(map).reduce((acc, plot) => acc + plot.area * plot.sides, 0);
}

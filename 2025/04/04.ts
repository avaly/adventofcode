import Matrix from '../../utils/Matrix.ts';
import Coords from '../../utils/Coords.ts';

type Data = Matrix<string>;

function parse(input: string[]): Data {
	return Matrix.toStringMatrix(input);
}

function findRemovableRolls(data: Data): Coords[] {
	let removable: Coords[] = [];

	for (const { coords, position, value } of data) {
		if (value !== '@') {
			continue;
		}

		const neighborRolls = coords
			.neighborsAll(data)
			.filter(([neighborCoords]) => data.get(neighborCoords) === '@').length;

		if (neighborRolls < 4) {
			removable.push(coords);
		}
	}

	return removable;
}

export function part1(input: string[]): number {
	return findRemovableRolls(parse(input)).length;
}

export function part2(input: string[]): number {
	const data = parse(input);

	let removable: Coords[] = [];
	let result = 0;
	do {
		removable = findRemovableRolls(data);

		result += removable.length;

		for (const coords of removable) {
			data.set(coords, '.');
		}
	} while (removable.length > 0);

	return result;
}

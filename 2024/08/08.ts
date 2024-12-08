import Matrix from '../../utils/Matrix';
import { Coords2D } from '../../utils/types';
import {
	addCoords2D,
	decodeCoords2D,
	diffCoords2D,
	encodeCoords2D,
	negativeCoords2D,
} from '../../utils/utils';

type Antennas = Record<string, Coords2D[]>;

function parse(input: string[]): [Matrix<string>, Antennas] {
	const map = Matrix.toStringMatrix(input);
	const antennas: Antennas = {};

	map.data.map((line, y) =>
		line.map((value, x) => {
			if (value !== '.') {
				if (!antennas[value]) {
					antennas[value] = [];
				}
				antennas[value].push([x, y]);
			}
		}),
	);

	return [map, antennas];
}

function getPossibleNodes(pos: Coords2D, diff: Coords2D, map: Matrix<string>): Coords2D[] {
	let list = [];

	let node = addCoords2D(pos, diff);
	while (map.inBounds(node)) {
		list.push(node);
		node = addCoords2D(node, diff);
	}
	return list;
}

function buildAntiNodes(
	antennas: Antennas,
	map: Matrix<string>,
	part2: boolean = false,
): Coords2D[] {
	let antiNodes = new Set<string>();

	for (const antenna of Object.keys(antennas)) {
		const antennaAntiNodes = new Set<string>();
		const positions = antennas[antenna];

		for (let i = 0; i < positions.length; i++) {
			for (let j = 1; j < positions.length; j++) {
				if (i === j) {
					continue;
				}

				const diff = diffCoords2D(positions[i], positions[j]);

				const possibleNodes: Coords2D[] = [];

				if (part2) {
					possibleNodes.push(...getPossibleNodes(positions[i], diff, map));
					possibleNodes.push(...getPossibleNodes(positions[i], negativeCoords2D(diff), map));

					possibleNodes.push(...getPossibleNodes(positions[j], diff, map));
					possibleNodes.push(...getPossibleNodes(positions[j], negativeCoords2D(diff), map));
				} else {
					possibleNodes.push(addCoords2D(positions[i], diff));
					possibleNodes.push(addCoords2D(positions[j], negativeCoords2D(diff)));
				}

				for (const node of possibleNodes) {
					if (map.inBounds(node)) {
						antennaAntiNodes.add(encodeCoords2D(node));
					}
				}
			}
		}

		antiNodes = antiNodes.union(antennaAntiNodes);
	}

	return [...antiNodes].map(decodeCoords2D);
}

export function part1(input: string[]): number {
	const [map, antennas] = parse(input);

	return buildAntiNodes(antennas, map).length;
}

export function part2(input: string[]): number {
	const [map, antennas] = parse(input);

	return buildAntiNodes(antennas, map, true).length;
}

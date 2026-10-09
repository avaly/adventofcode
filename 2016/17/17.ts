import { OrientationMoveLetter } from '../../utils/constants.ts';
import Coords from '../../utils/Coords.ts';
import Matrix from '../../utils/Matrix.ts';
import type { Orientation } from '../../utils/types.ts';
import { md5 } from '../../utils/utils.ts';

const MAP = Matrix.initialize(4, 4, 0);
const STATE_ORIENTATIONS: Orientation[] = ['north', 'south', 'west', 'east'];
const VAULT = Coords.from([3, 3]);

function solve(passcode: string, part2: boolean = false): string {
	const queue: [Coords, string][] = [[Coords.from([0, 0]), '']];
	let maxPath = '';

	while (queue.length) {
		const [position, path] = queue.shift() as [Coords, string];

		if (position.equal(VAULT)) {
			if (part2) {
				if (path.length > maxPath.length) {
					maxPath = path;
				}
				continue;
			} else {
				return path;
			}
		}

		const state = md5(`${passcode}${path}`).substring(0, 4);

		for (const [neighbor, orientation] of position.neighborsDirect(MAP)) {
			const index = STATE_ORIENTATIONS.indexOf(orientation);
			const door = state.charCodeAt(index);
			if (door >= 98 && door <= 102) {
				queue.push([neighbor, `${path}${OrientationMoveLetter[orientation]}`]);
			}
		}
	}

	return maxPath;
}

export function part1(input: string[]): string {
	return solve(input[0]);
}

export function part2(input: string[]): number {
	return solve(input[0], true).length;
}

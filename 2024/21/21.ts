import { OrientationMove } from '../../utils/constants';
import Coords from '../../utils/Coords';
import Matrix from '../../utils/Matrix';
import { Move } from '../../utils/types';

type Seq = string[];
type Code = {
	input: Seq;
	length: number;
	value: number;
};

const CACHE = new Map<string, number>();
const PATHS = new Map<string, Seq[]>();

// prettier-ignore
export const KEYPAD_NUMERIC = Matrix.toStringMatrix([
	'789',
	'456',
	'123',
	' 0A',
]);
// prettier-ignore
export const KEYPAD_DIRECTIONAL = Matrix.toStringMatrix([
	' ^A',
	'<v>',
]);

const NUMERIC_KEYS: Record<string, Coords> = {};
const DIRECTIONAL_KEYS: Record<string, Coords> = {};

for (const { coords, value } of KEYPAD_NUMERIC) {
	if (value !== ' ') {
		NUMERIC_KEYS[value] = coords;
	}
}
for (const { coords, value } of KEYPAD_DIRECTIONAL) {
	if (value !== ' ') {
		DIRECTIONAL_KEYS[value] = coords;
	}
}

for (const key of Object.keys(NUMERIC_KEYS)) {
	for (const key2 of Object.keys(NUMERIC_KEYS)) {
		if (key !== key2) {
			findPath(KEYPAD_NUMERIC, NUMERIC_KEYS[key], NUMERIC_KEYS[key2]);
		} else {
			PATHS.set(`${key}-${key}`, [['A']]);
		}
	}
}

for (const key of Object.keys(DIRECTIONAL_KEYS)) {
	for (const key2 of Object.keys(DIRECTIONAL_KEYS)) {
		if (key !== key2) {
			findPath(KEYPAD_DIRECTIONAL, DIRECTIONAL_KEYS[key], DIRECTIONAL_KEYS[key2]);
		} else {
			PATHS.set(`${key}-${key}`, [['A']]);
		}
	}
}

function parse(input: string[]): Code[] {
	const data: Code[] = [];

	for (const line of input) {
		data.push({
			input: line.split(''),
			length: 0,
			value: parseInt(line, 10),
		});
	}

	return data;
}

function findPath(keypad: Matrix<string>, start: Coords, end: Coords): Seq[] {
	const cacheID = `${keypad.get(start)}-${keypad.get(end)}`;

	if (PATHS.has(cacheID)) {
		return PATHS.get(cacheID);
	}

	const queue: [Coords, number, Move[]][] = [[start, 0, []]];
	let min = Number.MAX_SAFE_INTEGER;
	let best: Seq = [];

	while (queue.length) {
		const [current, cost, path] = queue.shift();

		if (current.equal(end)) {
			if (min >= cost) {
				best = [...path, 'A'];
				PATHS.set(cacheID, min === cost ? [...(PATHS.get(cacheID) || []), best] : [best]);
				min = cost;
			}
		}

		for (const [neighbor, orientation] of current.neighborsDirect(keypad)) {
			if (neighbor.equal(start)) {
				continue;
			}

			const value = keypad.get(neighbor);
			if (value === ' ') {
				continue;
			}

			const move = OrientationMove[orientation];
			const newCost = cost + 1 + (path.length && path[path.length - 1] !== move ? 100 : 0);

			if (newCost <= min) {
				queue.push([neighbor, newCost, [...path, move]]);
			}
		}
	}

	return PATHS.get(cacheID);
}

function* generatePath(paths: Seq[][], selected: number[]) {
	const current = selected.length;

	if (selected.length === paths.length) {
		yield selected.map((value, index) => paths[index][value]).flat();
		return;
	}

	for (let i = 0; i < paths[current].length; i++) {
		yield* generatePath(paths, [...selected, i]);
	}
}

export function solveInput(keypad: Matrix<string>, input: Seq): Seq[] {
	let result: Seq[] = [];

	const keyPaths: Seq[][] = [];
	const keys = keypad.sizeY === 4 ? NUMERIC_KEYS : DIRECTIONAL_KEYS;

	let current = keys['A'];

	for (const value of input) {
		const key = keys[value];

		keyPaths.push(findPath(keypad, current, key));

		current = key;
	}

	for (const path of generatePath(keyPaths, [])) {
		result.push(path);
	}

	return result;
}

function shortestLength(start: string, end: string, level: number): number {
	const id = `${start}-${end}-${level}`;

	if (CACHE.has(id)) {
		return CACHE.get(id);
	}

	let paths = PATHS.get(`${start}-${end}`) || [['A']];

	let best = Number.MAX_SAFE_INTEGER;

	for (const path of paths) {
		let result = 0;
		let current = 'A';

		for (const next of path) {
			result += shortestLength(current, next, level - 1);
			current = next;
		}

		if (result < best) {
			best = result;
		}
	}

	CACHE.set(id, best);

	return best;
}

function solveCode(code: Code, robots: number) {
	const paths = solveInput(KEYPAD_NUMERIC, code.input);

	for (const key of Object.keys(DIRECTIONAL_KEYS)) {
		for (const key2 of Object.keys(DIRECTIONAL_KEYS)) {
			const id = `${key}-${key2}-0`;
			if (key !== key2) {
				CACHE.set(id, PATHS.get(`${key}-${key2}`)[0].length);
			} else {
				CACHE.set(id, 1);
			}
		}
	}

	let best = Number.MAX_SAFE_INTEGER;

	for (const path of paths) {
		let current = 'A';
		let result = 0;

		for (const target of path) {
			result += shortestLength(current, target, robots);
			current = target;
		}

		if (result < best) {
			best = result;
		}
	}

	code.length = best;
}

function score(code: Code): number {
	return code.value * code.length;
}

export function part1(input: string[]): number {
	const codes = parse(input);

	codes.forEach((code) => solveCode(code, 1));

	return codes.reduce((acc, code) => acc + score(code), 0);
}

export function part2(input: string[]): number {
	const codes = parse(input);

	codes.forEach((code) => solveCode(code, 24));

	return codes.reduce((acc, code) => acc + score(code), 0);
}

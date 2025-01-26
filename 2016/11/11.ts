import Matrix from '../../utils/Matrix';
import { generateUniqueCombinations } from '../../utils/generators';

type Data = {
	elements: string[];
	elevator: number;
	floors: [Set<string>, Set<string>, Set<string>, Set<string>];
	history: string[];
	steps: number;
};

function parse(input: string[], part2: boolean = false): Data {
	const data: Data = {
		elements: [],
		elevator: 0,
		floors: [new Set<string>(), new Set<string>(), new Set<string>(), new Set<string>()],
		history: [],
		steps: 0,
	};

	for (const [floor, line] of input.entries()) {
		const [, list] = line.split(' contains ');
		if (list.includes('nothing')) {
			continue;
		}

		const items = list.split(/, | and /);

		if (part2 && floor === 0) {
			items.push('an elerium generator');
			items.push('an elerium-compatible microchip');
			items.push('a dilithium generator');
			items.push('a dilithium-compatible microchip');
		}

		for (const item of items) {
			const id = item
				.replace(/^an? /, '')
				.replace(/(-compatible microchip| generator)\.?$/, '')
				.substring(0, 2)
				.toUpperCase();

			data.floors[floor].add(`${id}${item.includes('generator') ? 'g' : 'c'}`);

			if (!data.elements.includes(id)) {
				data.elements.push(id);
			}
		}
	}

	data.elements.sort();

	return data;
}

function printSolution(history: string[]) {
	let step = 1;
	for (const item of history) {
		const parts = item.split('-');
		const data: Data = {
			elements: [],
			elevator: parseInt(parts[0].substring(2), 10),
			history: [],
			floors: [new Set(), new Set(), new Set(), new Set()],
			steps: 0,
		};
		for (const object of parts.slice(1)) {
			const [id, floor] = object.split('.');
			const element = id.substring(0, 2);
			data.floors[parseInt(floor, 10)].add(id);
			if (!data.elements.includes(element)) {
				data.elements.push(element);
			}
		}
		console.log(`Step ${step++}`);
		printMap(data);
	}
}

function printMap(data: Data) {
	const map = Matrix.initialize(1 + data.elements.length * 2, 4, '.');

	map.setRaw(0, data.elevator, 'E');
	for (let floor = 0; floor < 4; floor++) {
		data.floors[floor].forEach((object) => {
			const index = data.elements.findIndex((item) => item === object.substring(0, 2));
			map.setRaw(index * 2 + (object.endsWith('g') ? 1 : 2), floor, object);
		});
	}

	map.print(4);
}

function printSmall(data: Data): string {
	return [
		`E.${data.elevator}`,
		...data.elements
			.map((element) => [
				`${element}c.${data.floors.findIndex((objects) => objects.has(`${element}c`))}`,
				`${element}g.${data.floors.findIndex((objects) => objects.has(`${element}g`))}`,
			])
			.flat(),
	].join('-');
}

function encode(data: Data): string {
	// This is the most important part of this puzzle:
	// The pairs are interchangeable - the elements don't count
	const pairs = data.elements.map((element) =>
		[
			data.floors.findIndex((objects) => objects.has(`${element}g`)),
			data.floors.findIndex((objects) => objects.has(`${element}c`)),
		].join(':'),
	);

	return `${pairs.sort().join('-')}-${data.elevator}`;
}

export function isFloorSafeForChip(floorObjects: string[], chip: string) {
	const element = chip.substring(0, 2);

	if (floorObjects.includes(`${element}g`)) {
		return true;
	}

	// OK to move with a chip if the new floor does not any other generators
	return !floorObjects.values().some((id) => id.endsWith('g'));
}

export function isFloorSafe(objects: string[]): boolean {
	if (!objects.length) {
		return true;
	}

	const generators = objects.filter((id) => id.endsWith('g'));
	const chips = objects.filter((id) => id.endsWith('c'));

	return chips.every(
		(chip) => !generators.length || generators.includes(`${chip.substring(0, 2)}g`),
	);
}

export function canLoad(data: Data, nextFloor: number, ids: string[]) {
	if (
		nextFloor < data.elevator &&
		data.floors.slice(0, data.elevator).every((floor) => floor.size === 0)
	) {
		return false;
	}

	const nextFloorObjects = [...data.floors[nextFloor], ...ids];
	const remainingObjects = [...data.floors[data.elevator]].filter((id) => !ids.includes(id));

	return isFloorSafe(nextFloorObjects) && isFloorSafe(remainingObjects);
}

function next(current: Data, floorDelta: number, chosen: string[]): Data {
	const result: Data = {
		elements: current.elements,
		elevator: current.elevator + floorDelta,
		floors: current.floors.map((objects) => new Set(objects)) as Data['floors'],
		history: [...current.history, printSmall(current)],
		steps: current.steps + 1,
	};

	for (const id of chosen) {
		result.floors[current.elevator].delete(id);
		result.floors[result.elevator].add(id);
	}

	return result;
}

function solve(data: Data): number {
	const seen = new Set<string>();
	const queued = new Set<string>();
	const queue: Data[] = [data];

	const add = (nextData: Data) => {
		const encoded = encode(nextData);
		if (!seen.has(encoded) && !queued.has(encoded)) {
			queue.push(nextData);
			queued.add(encoded);
		}
	};

	while (queue.length) {
		const current = queue.shift();
		const { elevator, floors, steps } = current;

		const encoded = encode(current);
		seen.add(encoded);
		queued.delete(encoded);

		// check final state
		if (floors.slice(0, 3).every((floor) => floor.size === 0)) {
			if (process.env.NODE_ENV !== 'test') {
				printSolution(current.history);
			}
			return steps;
		}

		const floorObjects = [...floors[elevator]].sort();

		for (const chosen of generateUniqueCombinations(floorObjects, [1, 2])) {
			// move up
			if (elevator < 3) {
				if (canLoad(current, elevator + 1, chosen)) {
					add(next(current, 1, chosen));
				}
			}
			// move down
			if (elevator > 0) {
				if (canLoad(current, elevator - 1, chosen)) {
					add(next(current, -1, chosen));
				}
			}
		}
	}

	return 0;
}

export function part1(input: string[]): number {
	return solve(parse(input));
}

export function part2(input: string[]): number {
	return solve(parse(input, true));
}

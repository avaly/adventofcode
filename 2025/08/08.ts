import { generateUniqueCombinations } from '../../utils/generators.ts';
import type { Coords3D } from '../../utils/types.ts';

type Data = Coords3D[];

function parse(input: string[]): Data {
	const data: Data = [];

	for (const line of input) {
		data.push(line.split(',').map(Number) as Coords3D);
	}

	return data;
}

function straightLineDistance(a: Coords3D, b: Coords3D): number {
	return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2);
}

function solve(data: Data, part2: boolean, connections: number): number {
	const size = data.length;
	const circuits = data.map((_, i) => i);
	const distances: [number, number, number][] = [];
	const circuitBoxes: Record<number, number> = {};
	for (const circuit of circuits) {
		circuitBoxes[circuit] = 1;
	}
	let circuitSizes: number[] = [];

	for (const [boxA, boxB] of generateUniqueCombinations(circuits, [2, 2])) {
		distances.push([boxA, boxB, straightLineDistance(data[boxA], data[boxB])]);
	}

	distances.sort((a, b) => a[2] - b[2]);

	let connected = 0;

	do {
		const [boxA, boxB] = distances.shift()!;

		if (circuits[boxA] !== circuits[boxB]) {
			const oldCircuit = circuits[boxB];
			const newCircuit = circuits[boxA];

			for (let j = 0; j < circuits.length; j++) {
				if (circuits[j] === oldCircuit) {
					circuits[j] = newCircuit;
					circuitBoxes[newCircuit]++;
					circuitBoxes[oldCircuit]--;
				}
			}
		}

		connected++;

		circuitSizes = Object.values(circuitBoxes);
		circuitSizes.sort((a, b) => b - a);

		if (part2 && circuitSizes[0] === size && circuitSizes[1] === 0) {
			return data[boxA][0] * data[boxB][0];
		}
	} while (part2 ? circuitSizes[1] > 0 : connected < connections);

	return circuitSizes.slice(0, 3).reduce((a, b) => a * b, 1);
}

export function part1(input: string[], connections: number = 1_000): number {
	return solve(parse(input), false, connections);
}

export function part2(input: string[]): number {
	return solve(parse(input), true, 0);
}

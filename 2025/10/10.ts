import { generateRepeatingCombinations } from '../../utils/generators.ts';
import Matrix from '../../utils/Matrix.ts';

type Lights = boolean[];
type Machine = {
	buttons: number[][];
	expected: Lights;
	voltage: number[];
};
type Data = Machine[];

function parse(input: string[]): Data {
	const data: Data = [];

	for (const line of input) {
		const match = /^\[([.#]+)\] ([^{]+) \{([\d,]+)\}$/.exec(line);

		data.push({
			buttons:
				match?.[2].split(' ').map((button) =>
					button
						.substring(1, button.length - 1)
						.split(',')
						.map((n) => parseInt(n, 10)),
				) || [],
			expected: match?.[1].split('').map((c) => c === '#') || [],
			voltage: match?.[3].split(',').map((v) => parseInt(v, 10)) || [],
		});
	}

	return data;
}

function safeRound(value: number, epsilon = 1e-9): number {
	if (Math.abs(value - Math.round(value)) < epsilon) {
		return Math.round(value);
	}
	return value;
}

function sum(values: number[]): number {
	return values.reduce((a, b) => a + b, 0);
}

function encode(lights: Lights): string {
	return lights.map((on) => (on ? '#' : '.')).join('');
}

function pressButton(lights: Lights, button: number[]): Lights {
	const newLights = [...lights];

	for (const index of button) {
		newLights[index] = !newLights[index];
	}

	return newLights;
}

function solvePart1(machine: Machine): number {
	const { buttons, expected } = machine;
	const target = encode(expected);
	let min = Infinity;

	for (let size = 1; size <= expected.length; size++) {
		for (const combo of generateRepeatingCombinations(buttons, [size, size])) {
			let lights = new Array(expected.length).fill(false);

			for (const button of combo) {
				lights = pressButton(lights, button);
			}

			if (encode(lights) === target) {
				return size;
			}
		}
	}

	return min;
}

function gaussianElimination(matrix: Matrix<number>): void {
	const { sizeX, sizeY } = matrix;
	const numVariables = sizeX - 1;
	const numEquations = sizeY;

	// ---------------------------------
	// Phase 1: Forward Elimination
	// ---------------------------------
	// Goal: Convert the augmented matrix to row echelon form (upper triangular).

	let pivotRow = 0;
	for (let pivotCol = 0; pivotCol < numVariables && pivotRow < numEquations; pivotCol++) {
		// Find a row (from pivotRow downwards) with a non-zero element in the current column.
		let pivotCandidateRow = pivotRow;
		while (
			pivotCandidateRow < numEquations &&
			Math.abs(matrix.get([pivotCol, pivotCandidateRow])) < 1e-9
		) {
			pivotCandidateRow++;
		}

		if (pivotCandidateRow < numEquations) {
			if (pivotCandidateRow !== pivotRow) {
				// Swap the current pivotRow with the pivotCandidateRow to bring the pivot to the right position.
				matrix.swapRows(pivotRow, pivotCandidateRow);
			}

			// Divide the entire pivotRow by the value of the pivot element (augmentedMatrix[pivotRow][j]).
			// This makes the pivot element equal to 1.
			let pivotValue = matrix.get([pivotCol, pivotRow]);
			if (pivotValue !== 1) {
				for (let x = pivotCol; x < sizeX; x++) {
					matrix.set([x, pivotRow], safeRound(matrix.get([x, pivotRow]) / pivotValue));
				}
			}

			// For every other row, subtract a multiple of the pivotRow to make its entry in the current column zero.
			for (let y = 0; y < numEquations; y++) {
				if (y !== pivotRow) {
					let factor = matrix.get([pivotCol, y]);
					if (factor !== 0) {
						for (let x = pivotCol; x < sizeX; x++) {
							matrix.set(
								[x, y],
								safeRound(matrix.get([x, y]) - factor * matrix.get([x, pivotRow])),
							);
						}
					}
				}
			}

			pivotRow++;
		}
	}
}

function gaussianEliminationSolution(matrix: Matrix<number>): number[] {
	const { sizeX, sizeY } = matrix;
	const numVariables = sizeX - 1;
	const numEquations = sizeY;

	// At this point, the matrix is in reduced row echelon form.
	// The solution can be read directly if there is a unique solution.

	// ---------------------------------
	// Phase 2: Back Substitution
	// ---------------------------------
	// Goal: Solve for each variable.
	// If the matrix is in reduced row echelon form, this step is simpler.

	let solution = new Array(numVariables).fill(0);

	for (let y = 0; y < numEquations; y++) {
		let pivotCol = -1;
		// Find the pivot in this row (the first '1')
		for (let x = 0; x < numVariables; x++) {
			if (matrix.get([x, y]) === 1) {
				// Check if it's a valid pivot (all other entries in col are 0)
				let isPivot = true;
				for (let r = 0; r < numEquations; r++) {
					if (r !== y && matrix.get([x, r]) !== 0) {
						isPivot = false;
						break;
					}
				}
				if (isPivot) {
					pivotCol = x;
					break;
				}
			}
		}

		if (pivotCol !== -1) {
			solution[pivotCol] = matrix.get([numVariables, y]);
		}
	}

	return solution;
}

function solvePart2(machine: Machine): number {
	const { buttons, voltage } = machine;

	const numEquations = voltage.length;
	const numVariables = buttons.length;

	const matrix = Matrix.initialize(numVariables, numEquations, 0);

	for (let i = 0; i < numEquations; i++) {
		for (let j = 0; j < numVariables; j++) {
			if (buttons[j].includes(i)) {
				matrix.setRaw(j, i, 1);
			}
		}
		matrix.setRaw(numVariables, i, voltage[i]);
	}

	gaussianElimination(matrix);

	const freeVariables = new Set<number>();

	// Find free variables after elimination
	for (let y = 0; y < numEquations; y++) {
		// Find the pivot in this row (the first '1')
		for (let x = 0; x < numVariables; x++) {
			if (matrix.get([x, y]) === 1) {
				for (let r = x + 1; r < numVariables; r++) {
					if (matrix.get([r, y]) !== 0) {
						freeVariables.add(r);
					}
				}
			}
		}
	}

	if (!freeVariables.size) {
		const solution = gaussianEliminationSolution(matrix);
		return sum(solution);
	}

	const variables = [...freeVariables];

	let minPresses = Infinity;
	const maxPressesPerButton = Math.max(...voltage);

	for (const combo of generateRepeatingCombinations(
		Array.from({ length: maxPressesPerButton + 1 }).map((_, i) => i),
		[variables.length, variables.length],
	)) {
		const solution = new Array(numVariables).fill(0);

		for (let i = 0; i < variables.length; i++) {
			solution[variables[i]] = combo[i];
		}

		for (let y = 0; y < numEquations; y++) {
			const equation = matrix.row(y);
			const pivotCol = equation.findIndex((value, x) => value === 1);
			if (pivotCol === -1) {
				continue;
			}

			let value = matrix.get([numVariables, y]);
			for (let x = pivotCol + 1; x < numVariables; x++) {
				value -= matrix.get([x, y]) * solution[x];
			}

			solution[pivotCol] = safeRound(value);
		}

		if (solution.some((v) => v < 0 || !Number.isInteger(v))) {
			continue;
		}

		if (sum(solution) < minPresses) {
			minPresses = sum(solution);
		}
	}

	return minPresses;
}

function solve(data: Data, part2: boolean = false): number {
	return sum(data.map((machine) => (part2 ? solvePart2(machine) : solvePart1(machine))));
}

export function part1(input: string[]): number {
	return solve(parse(input));
}

export function part2(input: string[]): number {
	return solve(parse(input), true);
}

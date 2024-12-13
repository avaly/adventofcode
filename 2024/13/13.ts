import { Coords2D } from '../../utils/types';

type Machine = {
	a: Coords2D;
	b: Coords2D;
	prize: Coords2D;
};

export function parse(input: string[]): Machine[] {
	return input
		.join('\n')
		.split('\n\n')
		.map((data) => {
			const machine = {
				a: [-1, 0],
				b: [-1, 0],
				prize: [-1, 0],
			} satisfies Machine;

			for (const match of data.matchAll(/[+=](\d+).+[+=](\d+)/g)) {
				const x = parseInt(match[1], 10);
				const y = parseInt(match[2], 10);

				if (machine.a[0] === -1) {
					machine.a = [x, y];
				} else if (machine.b[0] === -1) {
					machine.b = [x, y];
				} else if (machine.prize[0] === -1) {
					machine.prize = [x, y];
				}
			}

			return machine;
		});
}

export function solveMachine(machine: Machine): number {
	const { a, b, prize } = machine;

	// Ax * N + Bx * M = Px
	// Ay * N + By * M = Py

	// Extract `M` from 1st equation:
	// M = (Px - Ax * N) / Bx
	// Replace `M` in 2nd equation:
	// Ay * N + By * (Px - Ax * N) / Bx = Py
	// Split fraction:
	// Ay * N + By * Px / Bx - By * Ax * N / Bx = Py
	// Group by N:
	// (Ay - By * Ax / Bx) * N + By * Px / Bx = Py
	// Extract N:
	// N = (Py - By * Px / Bx) / (Ay - By * Ax / Bx)

	const countA = parseFloat(
		((prize[1] - (b[1] * prize[0]) / b[0]) / (a[1] - (b[1] * a[0]) / b[0])).toFixed(3),
	);

	// countA & countB must be integers
	if (!Number.isInteger(countA)) {
		return 0;
	}

	const countB = parseFloat(((prize[0] - a[0] * countA) / b[0]).toFixed(3));

	if (!Number.isInteger(countB)) {
		return 0;
	}

	return countA * 3 + countB;
}

export function part1(input: string[]): number {
	const machines = parse(input);

	return machines.map(solveMachine).reduce((acc, value) => acc + value, 0);
}

export function part2(input: string[]): number {
	const machines = parse(input);

	for (const machine of machines) {
		machine.prize[0] += 10000000000000;
		machine.prize[1] += 10000000000000;
	}

	return machines.map(solveMachine).reduce((acc, value) => acc + value, 0);
}

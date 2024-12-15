import Coords from '../../utils/Coords';

type Machine = {
	a: Coords;
	b: Coords;
	prize: Coords;
};

export function parse(input: string[]): Machine[] {
	return input
		.join('\n')
		.split('\n\n')
		.map((data) => {
			const machine = {
				a: Coords.from([-1, 0]),
				b: Coords.from([-1, 0]),
				prize: Coords.from([-1, 0]),
			} satisfies Machine;

			for (const match of data.matchAll(/[+=](\d+).+[+=](\d+)/g)) {
				const x = parseInt(match[1], 10);
				const y = parseInt(match[2], 10);

				if (machine.a.x === -1) {
					machine.a = Coords.from([x, y]);
				} else if (machine.b.x === -1) {
					machine.b = Coords.from([x, y]);
				} else if (machine.prize.x === -1) {
					machine.prize = Coords.from([x, y]);
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
		((prize.y - (b.y * prize.x) / b.x) / (a.y - (b.y * a.x) / b.x)).toFixed(3),
	);

	// countA & countB must be integers
	if (!Number.isInteger(countA)) {
		return 0;
	}

	const countB = parseFloat(((prize.x - a.x * countA) / b.x).toFixed(3));

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
		machine.prize.add(new Coords(10000000000000, 10000000000000));
	}

	return machines.map(solveMachine).reduce((acc, value) => acc + value, 0);
}

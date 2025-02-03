type Registry = 'a' | 'b' | 'c' | 'd';

type Operation =
	| ['cpy', number, Registry]
	| ['cpy', Registry, Registry]
	| ['inc', Registry]
	| ['dec', Registry]
	| ['jnz', Registry, number];

type Data = {
	operations: Operation[];
	registers: Record<Registry, number>;
};

function parse(input: string[], part2: boolean = false): Data {
	const data: Data = {
		operations: [],
		registers: {
			a: 0,
			b: 0,
			c: part2 ? 1 : 0,
			d: 0,
		},
	};

	for (const line of input) {
		const [op, ...args] = line.split(' ');
		data.operations.push(
			[
				op,
				op === 'cpy' && !/[a-d]/.exec(args[0]) ? parseInt(args[0], 10) : args[0],
				op === 'jnz' ? parseInt(args[1], 10) : args[1],
			].filter(Boolean) as Operation,
		);
	}

	return data;
}

function solve(data: Data): number {
	const { operations, registers } = data;

	let current = 0;

	while (current < operations.length) {
		const [op, ...args] = operations[current];

		// console.log('current', current, op, args, registers);

		switch (op) {
			case 'cpy':
				if (typeof args[0] === 'number') {
					registers[args[1]] = args[0];
				} else {
					registers[args[1]] = registers[args[0]];
				}
				break;
			case 'dec':
				registers[args[0]]--;
				break;
			case 'inc':
				registers[args[0]]++;
				break;
		}

		if (op === 'jnz' && registers[args[0]] !== 0) {
			// @ts-expect-error It's a number
			current += args[1];
		} else {
			current++;
		}
	}

	return registers.a;
}

export function part1(input: string[]): number {
	return solve(parse(input));
}

export function part2(input: string[]): number {
	return solve(parse(input, true));
}

type Operation = {
	op: 'AND' | 'OR' | 'XOR';
	operands: [string, string];
};
type Data = {
	operations: Map<string, Operation>;
	wires: Map<string, number | null>;
};

function parse(input: string[]): Data {
	const operations = new Map();
	const wires = new Map();
	const [part1, part2] = input.join('\n').split('\n\n');

	for (const line of part1.split('\n')) {
		const [wire, value] = line.split(': ');
		wires.set(wire, parseInt(value, 10));
	}

	for (const line of part2.split('\n')) {
		const [a, op, b, _, result] = line.split(' ');
		operations.set(result, {
			op,
			operands: [a, b],
		});
		if (!wires.has(a)) {
			wires.set(a, null);
		}
		if (!wires.has(b)) {
			wires.set(b, null);
		}
		wires.set(result, null);
	}

	return { operations, wires };
}

function buildResult(wires: Data['wires'], prefix: string): number {
	let result = 0;

	const prefixed = [...wires.entries()].filter(([key]) => key.startsWith(prefix));

	prefixed.sort((a, b) => (a[0] < b[0] ? 1 : -1));

	for (const item of prefixed) {
		result = result * 2 + item[1];
	}

	return result;
}

function solveWire(data: Data, wire: string, visited: string[]): number {
	if (visited.includes(wire)) {
		throw new Error('Impossible');
	}

	const { operations, wires } = data;
	const operation = operations.get(wire);

	const { op, operands } = operation;
	const [a, b] = operands;

	const valueA = wires.get(a) ?? solveWire(data, a, [...visited, wire]);
	const valueB = wires.get(b) ?? solveWire(data, b, [...visited, wire]);

	let valueResult: number;

	switch (op) {
		case 'AND':
			valueResult = valueA & valueB;
			break;
		case 'OR':
			valueResult = valueA | valueB;
			break;
		case 'XOR':
			valueResult = valueA !== valueB ? 1 : 0;
			break;
	}

	wires.set(wire, valueResult);
	return valueResult;
}

function* generateCombinations(keys: string[], count: number, selected: number[]) {
	if (selected.length === count) {
		yield selected;
		return;
	}

	for (let i = 0; i < keys.length; i++) {
		let valid = !selected.includes(i);

		if (valid) {
			yield* generateCombinations(keys, count, [...selected, i]);
		}
	}
}

function solveZ(data: Data): number | null {
	for (const key of data.wires.keys()) {
		if (key.startsWith('z')) {
			try {
				solveWire(data, key, []);
			} catch (err) {
				return null;
			}
		}
	}

	return buildResult(data.wires, 'z');
}

function validCombination(data: Data, expected: number, combo: number[]): boolean {
	const operations = new Map(data.operations);
	let wires = new Map(data.wires);

	const results = [...operations.keys()];

	for (let i = 0; i < combo.length - 1; i += 2) {
		const wireA = results[combo[i]];
		const wireB = results[combo[i + 1]];

		const operationA = operations.get(wireA);
		const operationB = operations.get(wireB);

		operations.set(wireA, operationB);
		operations.set(wireB, operationA);
	}

	for (const key of wires.keys()) {
		if (key.startsWith('z')) {
			try {
				solveWire({ operations, wires }, key, []);
			} catch (err) {
				return false;
			}
		}
	}

	if (solveZ({ operations, wires }) === expected) {
		// Try another set of inputs
		wires = new Map(data.wires);

		// x = 35184372088831
		// y = 1
		for (let i = 0; i < 45; i++) {
			wires.set(`x${String(i).padStart(2, '0')}`, 1);
			wires.set(`y${String(i).padStart(2, '0')}`, 0);
		}
		wires.set('y00', 1);

		return solveZ({ operations, wires }) === 35184372088832;
	}

	return false;
}

export function part1(input: string[]): number {
	const data = parse(input);

	return solveZ(data);
}

function findOperation(
	data: Data,
	op: Operation['op'],
	operand: string,
): [Operation, string] | undefined {
	const { operations } = data;

	for (const wire of operations.keys()) {
		const operation = operations.get(wire);
		if (operation.op === op && operation.operands.includes(operand)) {
			return [operation, wire];
		}
	}
}

export function part2(input: string[]): string {
	const data = parse(input);
	const { operations, wires } = data;
	const results = [...operations.keys()];

	const wrongPairs = [];

	for (const wire of operations.keys()) {
		const operation = operations.get(wire);
		if (
			operation.op === 'XOR' &&
			(operation.operands[0].startsWith('x') || operation.operands[1].startsWith('x'))
		) {
			const next = findOperation(data, 'XOR', wire);

			if (next && !next[1].startsWith('z')) {
				wrongPairs.push([next[1], `z${parseInt(operation.operands[0].substring(1), 10)}`]);
			}
		}
	}

	const x = buildResult(wires, 'x');
	const y = buildResult(wires, 'y');

	const seed = wrongPairs.flat().map((wire) => results.indexOf(wire));

	for (const combo of generateCombinations(results, 8, seed)) {
		if (validCombination(data, x + y, combo)) {
			return combo
				.map((i) => results[i])
				.toSorted()
				.join(',');
		}
	}
}

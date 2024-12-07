import { cloneArray } from '../../utils/utils';

type Equation = {
	members: number[];
	result: number;
};
const OPERATORS_PART1 = [1, 2];
const OPERATORS_PART2 = [1, 2, 3];

function parse(input: string[]): Equation[] {
	const data: Equation[] = [];

	for (const line of input) {
		const [result, rest] = line.split(': ');
		data.push({
			members: rest.split(' ').map(Number),
			result: parseInt(result, 10),
		});
	}

	return data;
}

function isEquationCorrect(equation: Equation, operators: number[]): boolean {
	// console.log('isEquationCorrect . operators:', operators);
	const { members, result } = equation;
	let value = members[0];

	for (let i = 0; i < operators.length; i++) {
		switch (operators[i]) {
			case 1:
				value += members[i + 1];
				break;
			case 2:
				value *= members[i + 1];
				break;
			case 3:
				value = Number(`${value}${members[i + 1]}`);
		}
	}

	// console.log('isEquationCorrect . result:', result, value);
	return result === value;
}

function isEquationSolvable(
	equation: Equation,
	operatorsValues: number[],
	operators: number[],
): boolean {
	const operatorsCount = equation.members.length - 1;
	// console.log('isEquationSolvable', operators);
	let solvable = false;

	operators.push(0);

	for (const op of operatorsValues) {
		operators[operators.length - 1] = op;
		// console.log('isEquationSolvable for', op, operators);

		if (operators.length === operatorsCount) {
			solvable = solvable || isEquationCorrect(equation, operators);
			continue;
		}

		solvable = solvable || isEquationSolvable(equation, operatorsValues, cloneArray(operators));
	}

	return solvable;
}

export function part1(input: string[]): number {
	const data = parse(input);

	return data
		.filter((eq) => isEquationSolvable(eq, OPERATORS_PART1, []))
		.map((eq) => eq.result)
		.reduce((acc, value) => acc + value, 0);
}

export function part2(input: string[]): number {
	const data = parse(input);

	return data
		.filter((eq) => isEquationSolvable(eq, OPERATORS_PART2, []))
		.map((eq) => eq.result)
		.reduce((acc, value) => acc + value, 0);
}

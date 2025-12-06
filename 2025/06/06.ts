import Matrix from '../../utils/Matrix.ts';

type Problem = [string, number[]];
type Data = Problem[];

function parse(input: string[], part2: boolean = false): Data {
	const data: Data = [];

	if (part2) {
		const count = input[input.length - 1].trim().split(/\s+/).length;

		for (let i = 0; i < count; i++) {
			data.push(['', []]);
		}

		const matrix = Matrix.toStringMatrix(input);

		let index = count - 1;
		for (let x = matrix.sizeX - 1; x >= 0; x--) {
			const column = matrix.column(x);

			if (column.join('').trim() === '') {
				index--;
				continue;
			}

			data[index][1].push(parseInt(column.slice(0, -1).join('').trim(), 10));

			if (column[column.length - 1] !== ' ') {
				data[index][0] = column[column.length - 1];
			}
		}
	} else {
		for (const line of input) {
			const parts = line.trim().split(/\s+/);

			if (!data.length) {
				for (const part of parts) {
					data.push(['', []]);
				}
			}

			if (/^\d+$/.exec(parts[0])) {
				for (const [index, value] of parts.entries()) {
					data[index][1].push(parseInt(value, 10));
				}
			} else {
				for (const [index, value] of parts.entries()) {
					data[index][0] = value;
				}
			}
		}
	}

	return data;
}

function solveProblem([operation, values]: Problem): number {
	return values.slice(1).reduce((acc, value) => {
		switch (operation) {
			case '+':
				return acc + value;
			case '-':
				return acc - value;
			case '*':
				return acc * value;
			case '/':
				return acc / value;
		}
	}, values[0]);
}

function solve(data: Data): number {
	return data.reduce((acc, problem) => acc + solveProblem(problem), 0);
}

export function part1(input: string[]): number {
	return solve(parse(input));
}

export function part2(input: string[]): number {
	return solve(parse(input, true));
}

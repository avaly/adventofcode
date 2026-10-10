type Data = {
	initial: boolean[];
	rows: number;
};

function parse(input: string[], part2: boolean = false): Data {
	return {
		initial: input[1].split('').map((char) => char === '^'),
		rows: part2 ? 400000 : parseInt(input[0], 10),
	};
}

function solve(data: Data, part2: boolean = false): number {
	let safe = 0;

	let current = [...data.initial];
	for (let r = 0; r < data.rows; r++) {
		safe += current.filter((item) => !item).length;

		current = current.map((center, index) => {
			const left = index > 0 ? current[index - 1] : false;
			const right = index < current.length - 1 ? current[index + 1] : false;
			return (
				(left && center && !right) ||
				(!left && center && right) ||
				(left && !center && !right) ||
				(!left && !center && right)
			);
		});
	}

	return safe;
}

export function part1(input: string[]): number {
	return solve(parse(input));
}

export function part2(input: string[]): number {
	return solve(parse(input, true));
}

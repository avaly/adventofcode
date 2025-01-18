function solve(data: string, part2: boolean = false): number {
	let remaining = data;
	let match;
	let result = 0;

	while ((match = /^([A-Z]*)\((\d+)x(\d+)\)/.exec(remaining))) {
		result += match[1].length;

		let size = parseInt(match[2], 10);
		let repeat = parseInt(match[3], 10);

		remaining = remaining.substring(match[0].length);

		const piece = remaining.substring(0, size);

		if (part2) {
			result += solve(piece, part2) * repeat;
		} else {
			result += piece.repeat(repeat).length;
		}

		remaining = remaining.substring(size);
	}

	result += remaining.length;

	return result;
}

export function part1(input: string[]): number {
	return solve(input[0]);
}

export function part2(input: string[]): number {
	return solve(input[0], true);
}

type Data = {
	patterns: string[];
	towels: string[];
};

let cache = new Map<string, number>();

function parse(input: string[]): Data {
	return {
		patterns: input.slice(2),
		towels: input[0].split(', '),
	};
}

function findCombinations(pattern: string, towels: string[]): number {
	if (cache.has(pattern)) {
		return cache.get(pattern);
	}

	let result = 0;

	for (const towel of towels) {
		if (pattern.length >= towel.length && pattern.startsWith(towel)) {
			if (pattern.length === towel.length) {
				result += 1;
			} else {
				result += findCombinations(pattern.substring(towel.length), towels);
			}
		}
	}

	cache.set(pattern, result);

	return result;
}

export function part1(input: string[]): number {
	const { patterns, towels } = parse(input);

	return patterns.filter((pattern) => findCombinations(pattern, towels) > 0).length;
}

export function part2(input: string[]): number {
	const { patterns, towels } = parse(input);

	return patterns
		.map((pattern) => findCombinations(pattern, towels))
		.reduce((acc, value) => acc + value, 0);
}

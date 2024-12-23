type Data = {
	nodes: string[];
	nodeVertices: Record<string, string[]>;
};

function parse(input: string[]): Data {
	const nodes = [];
	const nodeVertices = {};

	for (const line of input) {
		const [a, b] = line.split('-');

		if (!nodes.includes(a)) {
			nodes.push(a);
			nodeVertices[a] = [];
		}
		if (!nodes.includes(b)) {
			nodes.push(b);
			nodeVertices[b] = [];
		}

		nodeVertices[a].push(b);
		nodeVertices[b].push(a);
	}

	return { nodes, nodeVertices };
}

function isSCC(data: Data, nodes: string[]): boolean {
	const { nodeVertices } = data;

	for (const a of nodes) {
		for (const b of nodes) {
			if (a != b && !nodeVertices[a].includes(b)) {
				return false;
			}
		}
	}

	return true;
}

function dfs(
	data: Data,
	cycles: Set<string>,
	cycleLength: number,
	start: string,
	path: string[],
): number {
	const { nodeVertices } = data;

	const node = path[path.length - 1];

	if (cycleLength === 0) {
		const id = [...path].toSorted().join('-');
		if (!cycles.has(id) && isSCC(data, path)) {
			cycles.add(id);
		}
		return;
	}

	for (const next of nodeVertices[node]) {
		if (!path.includes(next)) {
			dfs(data, cycles, cycleLength - 1, start, [...path, next]);
		}
	}

	return 0;
}

function countCycles(data: Data, cycleLength: number): string[] {
	const { nodes } = data;

	const cycles = new Set<string>();

	for (const node of nodes) {
		dfs(data, cycles, cycleLength - 1, node, [node]);
	}

	return [...cycles];
}

export function part1(input: string[]): number {
	const data = parse(input);

	const cycles = countCycles(data, 3);

	return cycles.filter((cycle) => cycle.startsWith('t') || cycle.includes('-t')).length;
}

export function part2(input: string[]): string {
	const data = parse(input);
	const { nodes } = data;

	let best = [];
	let cycles = countCycles(data, 3).map((cycle) => cycle.split('-'));
	let unique = new Set<string>();

	while (cycles.length) {
		best = cycles[0];
		let nextCycles = [];

		for (const cycle of cycles) {
			for (const node of nodes) {
				if (!cycle.includes(node)) {
					const nextCycle = [...cycle, node];
					if (isSCC(data, nextCycle) && !unique.has(nextCycle.toSorted().join('-'))) {
						nextCycles.push(nextCycle);
						unique.add(nextCycle.toSorted().join('-'));
					}
				}
			}
		}

		cycles = nextCycles;
	}

	return best.toSorted().join(',');
}

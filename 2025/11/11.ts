type Data = {
	indexes: Record<string, number>;
	nodes: string[];
	wires: Record<string, string[]>;
};

function parse(input: string[]): Data {
	const wires: Record<string, string[]> = {};

	for (const line of input) {
		const [node, outputs] = line.split(': ');
		wires[node] = outputs.split(' ');
	}

	const nodes = Object.keys(wires);
	for (const outputs of Object.values(wires)) {
		for (const node of outputs) {
			if (!nodes.includes(node)) {
				nodes.push(node);
			}
		}
	}

	const indexes = nodes.reduce<Record<string, number>>((acc, node, index) => {
		acc[node] = index;
		return acc;
	}, {});

	return { indexes, nodes, wires };
}

/**
 * DFS + Topological Sort
 * The idea is to process nodes in topological order so that all paths leading to a node are computed before using it to calculate paths for dependent nodes.
 * In this approach, we are calculating the number of paths for each node from the source node. At the end, we can simply return the number of paths from source to destination by returning the value at destination index.
 */
function pathsBetweenFast(data: Data, from: number, to: number): number {
	const { nodes, wires } = data;
	const size = nodes.length;
	const adjacency = Array.from({ length: size }, () => []);
	const inDegree = new Array(size).fill(0);

	for (const [node, outputs] of Object.entries(wires)) {
		const fromIndex = data.indexes[node];
		for (const output of outputs) {
			const toIndex = data.indexes[output];
			adjacency[fromIndex].push(toIndex);
			inDegree[toIndex]++;
		}
	}

	const queue = [];
	for (let i = 0; i < size; i++) {
		if (inDegree[i] === 0) {
			queue.push(i);
		}
	}

	const paths = new Array(size).fill(0);
	paths[from] = 1;

	while (queue.length > 0) {
		const node = queue.shift();

		for (const other of adjacency[node]) {
			paths[other] += paths[node];
			if (--inDegree[other] === 0) {
				queue.push(other);
			}
		}
	}

	return paths[to];
}

function solve(data: Data, part2: boolean = false): number {
	const { nodes } = data;

	const start = nodes.findIndex((node) => node === (part2 ? 'svr' : 'you'));
	const finish = nodes.findIndex((node) => node === 'out');
	const dac = nodes.findIndex((node) => node === 'dac');
	const fft = nodes.findIndex((node) => node === 'fft');

	if (!part2) {
		return pathsBetweenFast(data, start, finish);
	}

	const startToDac = pathsBetweenFast(data, start, dac);
	const dacToFft = pathsBetweenFast(data, dac, fft);
	const fftToOut = pathsBetweenFast(data, fft, finish);

	const startToFft = pathsBetweenFast(data, start, fft);
	const fftToDac = pathsBetweenFast(data, fft, dac);
	const dacToOut = pathsBetweenFast(data, dac, finish);

	return startToDac * dacToFft * fftToOut + startToFft * fftToDac * dacToOut;
}

export function part1(input: string[]): number {
	return solve(parse(input));
}

export function part2(input: string[]): number {
	return solve(parse(input), true);
}

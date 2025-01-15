type Data = string[];

function parse(input: string[], part2: boolean = false): Data {
	return input;
}

function hasTLS(ip: string, ssl: boolean): boolean {
	let where = 'out';
	let seqs = {
		in: new Set<string>(),
		out: new Set<string>(),
	};
	const size = ssl ? 3 : 4;

	for (let i = 0; i < ip.length - size + 1; i++) {
		if (ip[i] === '[') {
			where = 'in';
		}
		if (ip[i] === ']') {
			where = 'out';
		}
		if (!ssl && ip[i] === ip[i + 3] && ip[i] !== ip[i + 1] && ip[i + 1] === ip[i + 2]) {
			seqs[where].add(ip.substring(i, i + size));
		}
		if (
			ssl &&
			ip[i] === ip[i + 2] &&
			ip[i] !== ip[i + 1] &&
			ip[i + 1] !== '[' &&
			ip[i + 1] !== ']'
		) {
			seqs[where].add(ip.substring(i, i + size));
		}
	}

	if (ssl) {
		return [...seqs.out].filter((seq) => seqs.in.has(`${seq[1]}${seq[0]}${seq[1]}`)).length > 0;
	}

	return seqs.out.size > 0 && seqs.in.size === 0;
}

function solve(data: Data, part2: boolean = false): number {
	return data.filter((ip) => hasTLS(ip, part2)).length;
}

export function part1(input: string[]): number {
	return solve(input);
}

export function part2(input: string[]): number {
	return solve(input, true);
}

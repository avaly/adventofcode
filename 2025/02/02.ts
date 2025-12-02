type Product = [number, number];
type Data = Product[];

function parse(input: string[]): Data {
	const data: Data = [];

	for (const line of input) {
		const products = line.split(',');
		for (const product of products) {
			const [a, b] = product.split('-').map((n) => parseInt(n, 10));
			data.push([a, b]);
		}
	}

	return data;
}

function isInvalid(value: string, maxParts: number): boolean {
	for (let parts = 2; parts <= maxParts; parts++) {
		if (value.length % parts !== 0) {
			continue;
		}
		const part = value.length / parts;

		const first = value.slice(0, part);

		for (let i = 1; i < parts; i++) {
			const segment = value.slice(i * part, (i + 1) * part);
			if (segment !== first) {
				break;
			}
			if (i === parts - 1) {
				return true;
			}
		}
	}

	return false;
}

function solve(data: Data, part2: boolean = false): number {
	return data.reduce((sum, [a, b]) => {
		let invalids = 0;

		for (let i = a; i <= b; i++) {
			const str = i.toString();
			if (isInvalid(str, part2 ? str.length : 2)) {
				invalids += i;
			}
		}

		return sum + invalids;
	}, 0);
}

export function part1(input: string[]): number {
	return solve(parse(input));
}

export function part2(input: string[]): number {
	return solve(parse(input), true);
}

type Disk = number[];
type Data = {
	disk: Disk;
	size: number;
};

function parse(input: string[]): Data {
	return {
		disk: readDisk(input[1]),
		size: parseInt(input[0], 10),
	};
}

function readDisk(data: string): Disk {
	return data.split('').map(Number);
}

export function checksum(disk: Disk): Disk {
	let result: Disk = [];

	let current = [...disk];
	do {
		result = [];
		for (let i = 0; i < current.length; i += 2) {
			if (current[i] === current[i + 1]) {
				result.push(1);
			} else {
				result.push(0);
			}
		}
		current = [...result];
	} while (result.length % 2 === 0);

	return result;
}

function fill(disk: Disk): Disk {
	return [...disk, 0, ...disk.reverse().map((item) => 1 - item)];
}

function solve({ disk, size }: Data): string {
	let current = [...disk];
	while (current.length < size) {
		current = fill(current);
	}

	return checksum(current.slice(0, size)).join('');
}

export function part1(input: string[]): string {
	return solve(parse(input));
}

export function part2(input: string[]): string {
	input[0] = '35651584';

	return solve(parse(input));
}

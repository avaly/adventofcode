export type Room = [string, number, string];
type Data = Room[];

const LETTER_A = 'a'.charCodeAt(0);
const LETTER_SPACE = ' '.charCodeAt(0);
const LETTERS_DELTA = 'z'.charCodeAt(0) - LETTER_A + 1;

function parse(input: string[], part2: boolean = false): Data {
	const data: Room[] = [];

	for (const line of input) {
		const match = /(.+)-(\d+)\[(.+)\]/.exec(line);
		data.push([match[1], parseInt(match[2], 10), match[3]]);
	}

	return data;
}

function isReal(room: Room): boolean {
	const letters = new Map<string, number>();

	for (const letter of room[0].replace(/-/g, '')) {
		letters.set(letter, (letters.get(letter) || 0) + 1);
	}

	const pairs = [...letters.entries()];

	pairs.sort((a, b) => (a[1] === b[1] ? (b[0] < a[0] ? 1 : -1) : b[1] - a[1]));

	return (
		pairs
			.slice(0, room[2].length)
			.map(([letter]) => letter)
			.join('') === room[2]
	);
}

export function decrypt([data, cypher]: Room): string {
	return String.fromCharCode(
		...data.split('').map((letter) => {
			if (letter === '-') {
				return LETTER_SPACE;
			}
			const letterIndex = letter.charCodeAt(0) - 'a'.charCodeAt(0);
			return ((letterIndex + (cypher % LETTERS_DELTA)) % LETTERS_DELTA) + LETTER_A;
		}),
	);
}

function solve(data: Data, part2: boolean = false): number {
	if (!part2) {
		return data.filter(isReal).reduce((acc, room) => acc + room[1], 0);
	}

	const rooms = data.map(decrypt);
	const index = rooms.findIndex((name) => name.includes('northpole'));

	return data[index][1];
}

export function part1(input: string[]): number {
	return solve(parse(input));
}

export function part2(input: string[]): number {
	return solve(parse(input, true), true);
}

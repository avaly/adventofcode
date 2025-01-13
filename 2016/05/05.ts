import { createHash } from 'crypto';

type Data = string;

function parse(input: string[], part2: boolean = false): Data {
	return input[0];
}

function md5(value: string): string {
	return createHash('md5').update(value).digest('hex');
}

function solve(data: Data, part2: boolean = false): string {
	let password: string[] = part2 ? ['', '', '', '', '', '', '', ''] : [];

	let n = 0;
	do {
		const hash = md5(`${data}${n}`);

		if (hash.startsWith('00000')) {
			if (part2) {
				const position = parseInt(hash.charAt(5), 10);
				const value = hash.charAt(6);

				if (!isNaN(position) && position < 8 && password[position] === '') {
					password[position] = value;
					if (!password.includes('')) {
						break;
					}
				}
			} else {
				password.push(hash.charAt(5));
				if (password.length === 8) {
					break;
				}
			}
		}

		n++;
	} while (true);

	return password.join('');
}

export function part1(input: string[]): string {
	return solve(parse(input));
}

export function part2(input: string[]): string {
	return solve(parse(input, true), true);
}

import test from 'node:test';
import { loadProgram } from './utils';
import { Day, Program } from './types';
import { readFileSync } from 'node:fs';

export async function testsFor(
	day: Day,
	fn: (day: Day, implementation: Program) => void,
): Promise<void> {
	await loadProgram(day).then((implementation) => {
		fn(day, implementation);
	});
}

export function cases<Input, Output>(
	[year, day]: Day,
	definitions: [Input, Output][],
	fn: (input: Input, output: Output) => void,
) {
	let index = 1;
	for (const [input, output] of definitions) {
		const title = JSON.stringify(input).substring(0, 20);
		test(`${year}-${day} - #${index} - ${title} = ${output}`, async () => {
			await fn(input, output);
		});
		index++;
	}
}

export function sample([year, day]: Day, fn: (input: string[]) => void, fileName = 'sample') {
	test(`${year}-${day} - ${fileName}`, async () => {
		const input = readFileSync(`./${year}/${day}/${fileName}.txt`, 'utf-8').trim().split('\n');

		await fn(input);
	});
}

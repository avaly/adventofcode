import { readFileSync } from 'node:fs';
import { loadProgram } from './utils';

if (process.argv.length < 4) {
	console.log('Usage: tsx ./utils/runner.ts <YEAR> <NUMBER>');
	process.exit(1);
}

const [, , year, day] = process.argv;

await loadProgram([year, day]).then(async ({ part1, part2 }) => {
	const input = readFileSync(`./${year}/${day}/input.txt`, 'utf-8').trim().split('\n');

	console.log('Part 1:', await part1(input));
	console.log('Part 2:', await part2(input));
});

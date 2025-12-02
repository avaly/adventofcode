import { strictEqual } from 'node:assert';

import { cases, sample, testsFor } from '../../utils/tests.ts';

testsFor(['2025', '02'], (day, { part1, part2 }) => {
	// prettier-ignore
	cases(
		day,
		[
			[['11-22'], 33],
			[['95-115'], 99],
			[['1188511880-1188511890'], 1188511885],
		],
		(input, output) => {
			strictEqual(part1(input), output);
		},
	);

	// prettier-ignore
	cases(
		day,
		[
			[['11-22'], 33],
			[['95-115'], 210],
			[['565653-565659'], 565656],
		],
		(input, output) => {
			strictEqual(part2(input), output);
		},
	);

	sample(day, (input) => {
		strictEqual(part1(input), 1227775554);
		strictEqual(part2(input), 4174379265);
	});
});

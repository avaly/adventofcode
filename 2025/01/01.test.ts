import { strictEqual } from 'node:assert';

import { cases, sample, testsFor } from '../../utils/tests.ts';

testsFor(['2025', '01'], (day, { part1, part2 }) => {
	// prettier-ignore
	cases(
		day,
		[
			[['L50'], 1],
			[['L51'], 0],
			[['L100'], 0],
			[['R50'], 1],
			[['R51'], 0],
			[['R100'], 0],
		],
		(input, output) => {
			strictEqual(part1(input), output);
		},
		'part1'
	);

	// prettier-ignore
	cases(
		day,
		[
			[['L49'], 0],
			[['L50'], 1],
			[['L51'], 1],
			[['L100'], 1],
			[['L149'], 1],
			[['L150'], 2],
			[['L151'], 2],
			[['R49'], 0],
			[['R50'], 1],
			[['R51'], 1],
			[['R100'], 1],
			[['R149'], 1],
			[['R150'], 2],
			[['R151'], 2],
			[['R1000'], 10],
		],
		(input, output) => {
			strictEqual(part2(input), output);
		},
		'part2'
	);

	sample(day, (input) => {
		strictEqual(part1(input), 3);
		strictEqual(part2(input), 6);
	});
});

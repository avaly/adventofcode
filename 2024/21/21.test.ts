import { strictEqual } from 'node:assert';

import { cases, sample, testsFor } from '../../utils/tests';
import { KEYPAD_DIRECTIONAL, KEYPAD_NUMERIC, solveInput, solveOne } from './21';
import Matrix from '../../utils/Matrix';

testsFor(['2024', '21'], (day, { part1, part2 }) => {
	cases(
		day,
		[
			[['029A'], 68 * 29],
			[['980A'], 60 * 980],
		],
		(input, output) => {
			strictEqual(part1(input), output);
		},
	);

	sample(day, (input) => {
		strictEqual(part1(input), 126384);
	});
});

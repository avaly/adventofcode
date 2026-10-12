import { strictEqual } from 'node:assert';

import { cases, sample, testsFor } from '../../utils/tests.ts';

testsFor(['2016', '21'], (day, { part1, part2 }) => {
	// prettier-ignore
	cases(
		day,
		[
			[['heabcgfd', 'move position 1 to position 5'], 'habcgefd'],
			[['egcdahbf', 'rotate based on position of letter a'], 'cdahbfeg'],
		],
		(input, output) => {
			strictEqual(part1(input), output);
		},
	);

	sample(day, (input) => {
		strictEqual(part1(input), 'decab');
	});
});

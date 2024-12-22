import { strictEqual } from 'node:assert';

import { cases, sample, testsFor } from '../../utils/tests';

testsFor(['2024', '22'], (day, { part1, part2 }) => {
	cases(
		day,
		[
			[['1'], 8685429],
			[['10'], 4700978],
		],
		(input, output) => {
			strictEqual(part1(input), output);
		},
	);

	sample(day, (input) => {
		strictEqual(part1(input), 37327623);
		strictEqual(part2(input), 24);
	});

	sample(
		day,
		(input) => {
			strictEqual(part2(input), 23);
		},
		'sample-2',
	);
});

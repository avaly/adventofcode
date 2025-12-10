import { strictEqual } from 'node:assert';

import { cases, sample, testsFor } from '../../utils/tests.ts';

testsFor(['2025', '09'], (day, { part1, part2 }) => {
	sample(day, (input) => {
		strictEqual(part1(input), 50);
		strictEqual(part2(input), 24);
	});

	sample(
		day,
		(input) => {
			strictEqual(part2(input), 40);
		},
		'sample-2',
	);
});

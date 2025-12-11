import { strictEqual } from 'node:assert';

import { cases, sample, testsFor } from '../../utils/tests.ts';

testsFor(['2025', '11'], (day, { part1, part2 }) => {
	sample(day, (input) => {
		strictEqual(part1(input), 5);
	});

	sample(
		day,
		(input) => {
			strictEqual(part2(input), 2);
		},
		'sample-2',
	);
});

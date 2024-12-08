import { strictEqual } from 'node:assert';

import { sample, testsFor } from '../../utils/tests';

testsFor(['2024', '08'], (day, { part1, part2 }) => {
	sample(day, (input) => {
		strictEqual(part1(input), 14);
		strictEqual(part2(input), 34);
	});

	sample(
		day,
		(input) => {
			// strictEqual(part1(input), 14);
			strictEqual(part2(input), 9);
		},
		'sample-2',
	);
});

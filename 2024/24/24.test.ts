import { strictEqual } from 'node:assert';

import { sample, testsFor } from '../../utils/tests';

testsFor(['2024', '24'], (day, { part1, part2 }) => {
	sample(day, (input) => {
		strictEqual(part1(input), 4);
	});

	sample(
		day,
		(input) => {
			strictEqual(part1(input), 2024);
		},
		'sample-2',
	);
});

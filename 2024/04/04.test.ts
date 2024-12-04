import { strictEqual } from 'node:assert';

import { sample, testsFor } from '../../utils/tests';

testsFor(['2024', '04'], (day, { part1, part2 }) => {
	sample(
		day,
		(input) => {
			strictEqual(part1(input), 4);
		},
		'sample-small',
	);

	sample(day, (input) => {
		strictEqual(part1(input), 18);
		strictEqual(part2(input), 9);
	});
});

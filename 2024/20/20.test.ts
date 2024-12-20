import { strictEqual } from 'node:assert';

import { sample, testsFor } from '../../utils/tests';

testsFor(['2024', '20'], (day, { part1, part2 }) => {
	sample(day, (input) => {
		strictEqual(part1(input), 0);
		strictEqual(part2(input), 0);
	});

	sample(
		day,
		(input) => {
			strictEqual(part1(input), 1289);
			strictEqual(part2(input), 982425);
		},
		'input',
	);
});

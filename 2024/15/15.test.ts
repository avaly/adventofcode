import { strictEqual } from 'node:assert';

import { sample, testsFor } from '../../utils/tests';

testsFor(['2024', '15'], (day, { part1, part2 }) => {
	sample(day, (input) => {
		strictEqual(part1(input), 2028);
	});

	sample(
		day,
		(input) => {
			strictEqual(part1(input), 10092);
			strictEqual(part2(input), 9021);
		},
		'sample-2',
	);

	sample(
		day,
		(input) => {
			strictEqual(part2(input), 618);
		},
		'sample-3',
	);
});

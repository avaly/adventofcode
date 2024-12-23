import { strictEqual } from 'node:assert';

import { sample, testsFor } from '../../utils/tests';

testsFor(['2024', '23'], (day, { part1, part2 }) => {
	sample(day, (input) => {
		strictEqual(part1(input), 7);
		strictEqual(part2(input), 'co,de,ka,ta');
	});

	sample(
		day,
		(input) => {
			strictEqual(part1(input), 3);
			strictEqual(part2(input), 'co,de,ka,ta');
		},
		'sample-2',
	);
});

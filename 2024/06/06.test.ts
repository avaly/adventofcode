import { strictEqual } from 'node:assert';

import { sample, testsFor } from '../../utils/tests';

testsFor(['2024', '06'], (day, { part1, part2 }) => {
	sample(day, (input) => {
		strictEqual(part1(input), 41);
		strictEqual(part2(input), 6);
	});

	sample(
		day,
		(input) => {
			strictEqual(part2(input), 1);
		},
		'sample-1',
	);

	sample(
		day,
		(input) => {
			strictEqual(part2(input), 1);
		},
		'sample-2',
	);

	sample(
		day,
		(input) => {
			strictEqual(part2(input), 6);
		},
		'sample-3',
	);

	sample(
		day,
		(input) => {
			strictEqual(part2(input), 7);
		},
		'sample-4',
	);

	sample(
		day,
		(input) => {
			strictEqual(part2(input), 3);
		},
		'sample-5',
	);
});

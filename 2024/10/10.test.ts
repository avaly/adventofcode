import { strictEqual } from 'node:assert';

import { cases, sample, testsFor } from '../../utils/tests';

testsFor(['2024', '10'], (day, { part1, part2 }) => {
	sample(
		day,
		(input) => {
			strictEqual(part1(input), 2);
		},
		'sample-1',
	);

	sample(
		day,
		(input) => {
			strictEqual(part1(input), 4);
			strictEqual(part2(input), 13);
		},
		'sample-2',
	);

	sample(
		day,
		(input) => {
			strictEqual(part1(input), 3);
		},
		'sample-3',
	);

	sample(
		day,
		(input) => {
			strictEqual(part2(input), 3);
		},
		'sample-4',
	);

	sample(
		day,
		(input) => {
			strictEqual(part2(input), 227);
		},
		'sample-5',
	);

	sample(day, (input) => {
		strictEqual(part1(input), 36);
		strictEqual(part2(input), 81);
	});
});

import { strictEqual } from 'node:assert';

import { sample, testsFor } from '../../utils/tests';

testsFor(['2024', '12'], (day, { part1, part2 }) => {
	sample(day, (input) => {
		strictEqual(part1(input), 140);
		strictEqual(part2(input), 80);
	});

	sample(
		day,
		(input) => {
			strictEqual(part1(input), 772);
			strictEqual(part2(input), 436);
		},
		'sample-2',
	);

	sample(
		day,
		(input) => {
			strictEqual(part1(input), 1930);
			strictEqual(part2(input), 1206);
		},
		'sample-3',
	);

	sample(
		day,
		(input) => {
			strictEqual(part2(input), 236);
		},
		'sample-4',
	);

	sample(
		day,
		(input) => {
			strictEqual(part2(input), 368);
		},
		'sample-5',
	);
});

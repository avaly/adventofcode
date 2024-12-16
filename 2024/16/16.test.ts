import { strictEqual } from 'node:assert';

import { sample, testsFor } from '../../utils/tests';

testsFor(['2024', '16'], (day, { part1, part2 }) => {
	sample(day, (input) => {
		strictEqual(part1(input), 7036);
		strictEqual(part2(input), 45);
	});

	sample(
		day,
		(input) => {
			strictEqual(part1(input), 11048);
			strictEqual(part2(input), 64);
		},
		'sample-2',
	);

	sample(
		day,
		(input) => {
			strictEqual(part1(input), 4014);
		},
		'sample-3',
	);

	sample(
		day,
		(input) => {
			strictEqual(part1(input), 3018);
		},
		'sample-4',
	);

	sample(
		day,
		(input) => {
			strictEqual(part1(input), 1009);
		},
		'sample-5',
	);

	sample(
		day,
		(input) => {
			strictEqual(part1(input), 2009);
		},
		'sample-6',
	);

	sample(
		day,
		(input) => {
			strictEqual(part1(input), 2005);
		},
		'sample-7',
	);

	sample(
		day,
		(input) => {
			strictEqual(part1(input), 13076);
		},
		'sample-8',
	);

	sample(
		day,
		(input) => {
			strictEqual(part1(input), 2010);
		},
		'sample-9',
	);

	sample(
		day,
		(input) => {
			strictEqual(part1(input), 3008);
		},
		'sample-10',
	);

	sample(
		day,
		(input) => {
			strictEqual(part1(input), 21148);
			strictEqual(part2(input), 149);
		},
		'sample-11',
	);
});

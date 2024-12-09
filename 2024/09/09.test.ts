import { strictEqual } from 'node:assert';

import { cases, sample, testsFor } from '../../utils/tests';

testsFor(['2024', '09'], (day, { part1, part2 }) => {
	// prettier-ignore
	cases(
		day,
		[
			[['12345'], 60],
			[['111111111111111111111'], 290],
		],
		(input, output) => {
			strictEqual(part1(input), output);
		},
	);

	// prettier-ignore
	cases(
		day,
		[
			[['111'], 1], // 0.1 => 01.
			[['112'], 5], // 0.11 => 0.11
			[['122'], 3], // 0..11 => 011..
			[['11132'], 15], // 0.1...22 => 01.22...
			[['21132'], 20], // 00.1...22 => 001.22..
			[['131110201'], 33], // 0...1.2334 => 043312.....
		],
		(input, output) => {
			strictEqual(part2(input), output);
		},
	);

	sample(day, (input) => {
		strictEqual(part1(input), 1928);
		strictEqual(part2(input), 2858);
	});
});

import { strictEqual } from 'node:assert';

import { cases, sample, testsFor } from '../../utils/tests';

testsFor(['2024', '07'], (day, { part1, part2 }) => {
	// prettier-ignore
	cases(
		day,
		[
			[['190: 10 19'], 190],
			[['292: 11 6 16 20'], 292],
			[['156: 15 6'], 0],
		],
		(input, output) => {
			strictEqual(part1(input), output);
		},
	);

	// prettier-ignore
	cases(
		day,
		[
			[['156: 15 6'], 156],
			[['7290: 6 8 6 15'], 7290],
			[['192: 17 8 14'], 192],
		],
		(input, output) => {
			strictEqual(part2(input), output);
		},
	);

	sample(day, (input) => {
		strictEqual(part1(input), 3749);
		strictEqual(part2(input), 11387);
	});
});

import { strictEqual } from 'node:assert';

import { cases, sample, testsFor } from '../../utils/tests.ts';

testsFor(['2025', '03'], (day, { part1, part2 }) => {
	// prettier-ignore
	cases(
		day,
		[
			[['987654321111111'], 98],
			[['811111111111119'], 89],
		],
		(input, output) => {
			strictEqual(part1(input), output);
		},
	);

	// prettier-ignore
	cases(
		day,
		[
			[['987654321111111'], 987654321111],
			[['811111111111119'], 811111111119],
			[['234234234234278'], 434234234278],
			[['818181911112111'], 888911112111],
		],
		(input, output) => {
			strictEqual(part2(input), output);
		},
	);

	sample(day, (input) => {
		strictEqual(part1(input), 357);
		strictEqual(part2(input), 3121910778619);
	});
});

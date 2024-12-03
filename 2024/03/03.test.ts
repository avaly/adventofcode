import { strictEqual } from 'node:assert';

import { cases, sample, testsFor } from '../../utils/tests';

testsFor(['2024', '03'], (day, { part1, part2 }) => {
	// prettier-ignore
	cases(
		day,
		[
			[['xmul(2,4)%'], 8],
			[['xmul(2,4)%', 'mul(1,2)'], 10],
		],
		(input, output) => {
			strictEqual(part1(input), output);
		},
	);

	sample(day, (input) => {
		strictEqual(part1(input), 161);
	});

	sample(
		day,
		(input) => {
			strictEqual(part2(input), 48);
		},
		'sample2',
	);
});

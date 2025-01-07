import { strictEqual } from 'node:assert';

import { cases, testsFor } from '../../utils/tests';

testsFor(['2016', '01'], (day, { part1, part2 }) => {
	cases(
		day,
		// prettier-ignore
		[
			[['R2, L3'], 5],
			[['R2, R2, R2'], 2],
			[['R5, L5, R5, R3'], 12],
			[['R8, R4, R4, R8'], 8],
		],
		(input, output) => {
			strictEqual(part1(input), output);
		},
	);

	cases(
		day,
		// prettier-ignore
		[
			[['R8, R4, R4, R8'], 4],
		],
		(input, output) => {
			strictEqual(part2(input), output);
		},
	);
});

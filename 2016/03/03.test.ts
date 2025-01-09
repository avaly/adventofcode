import { strictEqual } from 'node:assert';

import { cases, sample, testsFor } from '../../utils/tests';

testsFor(['2016', '03'], (day, { part1, part2 }) => {
	// prettier-ignore
	cases( day, [
		[['5 10 25'], 0],
		[['5 10 11'], 1],
		[['  775  785  361'], 1],
  ], (input, output) => {
		strictEqual(part1(input), output);
  });

	// prettier-ignore
	cases(
		day,
		[
			[
				[
					'101 301 501',
					'102 302 502',
					'103 303 503',
					'201 401 601',
					'202 402 602',
					'203 403 603'
				],
				6,
			],
		],
		(input, output) => {
			strictEqual(part2(input), output);
		},
	);
});

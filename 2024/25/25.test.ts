import { strictEqual } from 'node:assert';

import { cases, sample, testsFor } from '../../utils/tests';
import { Device, matches } from './25';

testsFor(['2024', '25'], (day, { part1 }) => {
	cases<[Device, Device], boolean>(
		day,
		[
			[
				[
					[5, 0, 2, 1, 3],
					[0, 5, 3, 4, 3],
				],
				false,
			],
			[
				[
					[3, 0, 2, 0, 1],
					[0, 5, 3, 4, 3],
				],
				true,
			],
		],
		(input, output) => {
			strictEqual(matches(input[0], input[1]), output);
		},
	);

	sample(day, (input) => {
		strictEqual(part1(input), 3);
	});
});

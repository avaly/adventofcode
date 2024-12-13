import { strictEqual } from 'node:assert';

import { cases, sample, testsFor } from '../../utils/tests';
import { parse, solveMachine } from './13';

testsFor(['2024', '13'], (day, { part1, part2 }) => {
	cases(
		day,
		[
			[['Button A: X+94, Y+34', 'Button B: X+22, Y+67', 'Prize: X=8400, Y=5400'], 280],
			[['Button A: X+26, Y+66', 'Button B: X+67, Y+21', 'Prize: X=12748, Y=12176'], 0],
			[['Button A: X+17, Y+86', 'Button B: X+84, Y+37', 'Prize: X=7870, Y=6450'], 200],
			[['Button A: X+38, Y+79', 'Button B: X+28, Y+13', 'Prize: X=3648, Y=4148'], 196],
		],
		(input, output) => {
			strictEqual(solveMachine(parse(input)[0]), output);
		},
	);

	cases(
		day,
		[
			[
				[
					'Button A: X+94, Y+34',
					'Button B: X+22, Y+67',
					'Prize: X=10000000008400, Y=10000000005400',
				],
				0,
			],
			[
				[
					'Button A: X+26, Y+66',
					'Button B: X+67, Y+21',
					'Prize: X=10000000012748, Y=10000000012176',
				],
				459236326669,
			],
		],
		(input, output) => {
			strictEqual(solveMachine(parse(input)[0]), output);
		},
	);

	sample(day, (input) => {
		strictEqual(part1(input), 480);
		// strictEqual(part2(input), 875318608908);
	});
});

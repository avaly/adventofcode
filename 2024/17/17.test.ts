import { deepEqual, strictEqual } from 'node:assert';

import { cases, sample, testsFor } from '../../utils/tests';
import { execute, Data } from './17';

testsFor(['2024', '17'], (day, { part1, part2 }) => {
	cases<Omit<Data, 'commands'>, Omit<Data, 'commands' | 'program'>>(
		day,
		[
			[
				{
					output: [],
					program: [2, 6],
					registers: [0, 0, 9],
				},
				{
					output: [],
					registers: [0, 1, 9],
				},
			],
			[
				{
					output: [],
					program: [5, 0, 5, 1, 5, 4],
					registers: [10, 0, 0],
				},
				{
					output: [0, 1, 2],
					registers: [10, 0, 0],
				},
			],
			[
				{
					output: [],
					program: [0, 1, 5, 4, 3, 0],
					registers: [2024, 0, 0],
				},
				{
					output: [4, 2, 5, 6, 7, 7, 7, 7, 3, 1, 0],
					registers: [0, 0, 0],
				},
			],
			[
				{
					output: [],
					program: [1, 7],
					registers: [0, 29, 0],
				},
				{
					output: [],
					registers: [0, 26, 0],
				},
			],
			[
				{
					output: [],
					program: [4, 0],
					registers: [0, 2024, 43690],
				},
				{
					output: [],
					registers: [0, 44354, 43690],
				},
			],
			[
				{
					output: [],
					program: [0, 3, 5, 4, 3, 0],
					registers: [117440, 0, 0],
				},
				{
					output: [0, 3, 5, 4, 3, 0],
					registers: [0, 0, 0],
				},
			],
		],
		(input, expected) => {
			execute(input);

			deepEqual(input.output, expected.output);
			deepEqual(input.registers, expected.registers);
		},
	);

	sample(day, (input) => {
		strictEqual(part1(input), '4,6,3,5,6,3,5,2,1,0');
	});

	sample(
		day,
		(input) => {
			strictEqual(part2(input), 117440);
		},
		'sample-2',
	);

	sample(
		day,
		(input) => {
			strictEqual(part2(input), 7508672);
		},
		'sample-3',
	);

	sample(
		day,
		(input) => {
			strictEqual(part2(input), 1028612640);
		},
		'sample-4',
	);
});

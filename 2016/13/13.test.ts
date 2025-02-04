import { strictEqual } from 'node:assert';

import { cases, sample, testsFor } from '../../utils/tests';
import Coords from '../../utils/Coords';
import { isWall } from './13';

testsFor(['2016', '13'], (day, { part1, part2 }) => {
	cases<[[number, number], number], boolean>(
		day,
		[
			[[[0, 0], 10], false],
			[[[1, 0], 10], true],
			[[[1, 1], 10], false],
			[[[2, 0], 10], false],
			[[[3, 0], 10], true],
		],
		(input, output) => {
			strictEqual(isWall(Coords.from(input[0]), input[1]), output);
		},
	);

	sample(day, (input) => {
		strictEqual(part1(input), 11);
		strictEqual(part2(input), 25);
	});
});

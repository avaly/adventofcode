import { strictEqual } from 'node:assert';

import { cases, sample, testsFor } from '../../utils/tests';
import { parse, solve } from './11';

testsFor(['2024', '11'], (day, { part1, part2 }) => {
	// prettier-ignore
	cases<[string, number], number>( day, [
		[['0 1 10 99 999', 1], 7],
		[['125 17', 1], 3],
		[['125 17', 2], 4],
		[['125 17', 6], 22],
  ], (input, output) => {
		strictEqual(solve(parse([input[0]]), input[1]), output);
  });

	sample(day, (input) => {
		strictEqual(part1(input), 55312);
		strictEqual(part2(input), 65601038650482);
	});
});

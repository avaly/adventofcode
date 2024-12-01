import { strictEqual } from 'node:assert';

import { cases, sample, testsFor } from '../../utils/tests';

testsFor(['2024', '01'], (day, { part1, part2 }) => {
	// prettier-ignore
	cases( day, [
    [['3   7'], 4],
  ], (input, output) => {
    strictEqual(part1(input), output);
  });

	cases(
		day,
		[
			[['3   7'], 0],
			[['3   3'], 3],
			[['3   3', '1   3'], 6],
		],
		(input, output) => {
			strictEqual(part2(input), output);
		},
	);

	sample(day, (input) => {
		strictEqual(part1(input), 11);
		strictEqual(part2(input), 31);
	});
});

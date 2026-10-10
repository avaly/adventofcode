import { strictEqual } from 'node:assert';

import { cases, sample, testsFor } from '../../utils/tests.ts';

testsFor(['2016', '19'], (day, { part1, part2 }) => {
	// prettier-ignore
	cases( day, [
		[['5'], 3],
		[['10'], 5],
	], (input, output) => {
		strictEqual(part1(input), output);
	});

	// prettier-ignore
	cases(day, [
    [['5'], 2],
  ], (input, output) => {
    strictEqual(part2(input), output);
  });
});

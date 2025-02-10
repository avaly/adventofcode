import { strictEqual } from 'node:assert';

import { cases, testsFor } from '../../utils/tests';

testsFor(['2016', '14'], (day, { part1, part2 }) => {
	// prettier-ignore
	cases( day, [
		[['abc'], 22728],
  ], (input, output) => {
		strictEqual(part1(input), output);
  });

	// prettier-ignore
	cases(day, [
	  [['abc'], 22551],
	], (input, output) => {
	  strictEqual(part2(input), output);
	});
});

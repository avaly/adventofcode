import { strictEqual } from 'node:assert';

import { cases, sample, testsFor } from '../../utils/tests.ts';

testsFor(['2016', '18'], (day, { part1 }) => {
	// prettier-ignore
	cases( day, [
		[['3', '..^^.'], 6],
  ], (input, output) => {
		strictEqual(part1(input), output);
  });

	sample(day, (input) => {
		strictEqual(part1(input), 38);
	});
});

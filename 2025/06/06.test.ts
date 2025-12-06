import { strictEqual } from 'node:assert';

import { cases, sample, testsFor } from '../../utils/tests.ts';

testsFor(['2025', '06'], (day, { part1, part2 }) => {
	// prettier-ignore
	cases( day, [
		[['123', '45', '6', '*'], 33210],
	], (input, output) => {
		strictEqual(part1(input), output);
	});

	// prettier-ignore
	cases(day, [
		[['123', ' 45', '  6', '*  '], 8544],
	], (input, output) => {
	  strictEqual(part2(input), output);
	});

	sample(day, (input) => {
		// strictEqual(part1(input), 4277556);
		strictEqual(part2(input), 3263827);
	});
});

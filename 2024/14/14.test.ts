import { strictEqual } from 'node:assert';

import { cases, sample, testsFor } from '../../utils/tests';

testsFor(['2024', '14'], (day, { part1 }) => {
	cases(day, [[['11,7', 'p=2,4 v=2,-3', 'p=6,3 v=-1,-3'], 0]], (input, output) => {
		strictEqual(part1(input), output);
	});

	sample(day, (input) => {
		strictEqual(part1(input), 12);
	});
});

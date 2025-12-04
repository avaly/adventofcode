import { strictEqual } from 'node:assert';

import { cases, sample, testsFor } from '../../utils/tests.ts';

testsFor(['2025', '04'], (day, { part1, part2 }) => {
	sample(day, (input) => {
		strictEqual(part1(input), 13);
		strictEqual(part2(input), 43);
	});
});

import { strictEqual } from 'node:assert';

import { cases, sample, testsFor } from '../../utils/tests.ts';

testsFor(['2025', '05'], (day, { part1, part2 }) => {
	sample(day, (input) => {
		strictEqual(part1(input), 3);
		strictEqual(part2(input), 14);
	});
});

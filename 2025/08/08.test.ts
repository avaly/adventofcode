import { strictEqual } from 'node:assert';

import { sample, testsFor } from '../../utils/tests.ts';

testsFor(['2025', '08'], (day, { part1, part2 }) => {
	sample(day, (input) => {
		strictEqual(part1(input, 10), 40);
		strictEqual(part2(input), 25272);
	});
});

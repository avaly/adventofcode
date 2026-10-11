import { strictEqual } from 'node:assert';

import { sample, testsFor } from '../../utils/tests.ts';

testsFor(['2016', '20'], (day, { part1, part2 }) => {
	sample(day, (input) => {
		strictEqual(part1(input), 3);
		strictEqual(part2(input), 4294967286);
	});
});

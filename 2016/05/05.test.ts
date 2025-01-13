import { strictEqual } from 'node:assert';

import { sample, testsFor } from '../../utils/tests';

testsFor(['2016', '05'], (day, { part1, part2 }) => {
	sample(day, (input) => {
		// strictEqual(part1(input), '18f47a30');
		strictEqual(part2(input), '05ace8e3');
	});
});

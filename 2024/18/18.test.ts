import { strictEqual } from 'node:assert';

import { sample, testsFor } from '../../utils/tests';

testsFor(['2024', '18'], (day, { part1, part2 }) => {
	sample(day, (input) => {
		strictEqual(part1(input), 22);
		strictEqual(part2(input), '6,1');
	});
});

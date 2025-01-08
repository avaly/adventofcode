import { strictEqual } from 'node:assert';

import { sample, testsFor } from '../../utils/tests';

testsFor(['2016', '02'], (day, { part1, part2 }) => {
	sample(day, (input) => {
		strictEqual(part1(input), '1985');
		strictEqual(part2(input), '5DB3');
	});
});

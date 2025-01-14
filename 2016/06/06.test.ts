import { strictEqual } from 'node:assert';

import { sample, testsFor } from '../../utils/tests';

testsFor(['2016', '06'], (day, { part1, part2 }) => {
	sample(day, (input) => {
		strictEqual(part1(input), 'easter');
		strictEqual(part2(input), 'advent');
	});
});

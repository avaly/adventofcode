import { strictEqual } from 'node:assert';

import { sample, testsFor } from '../../utils/tests';

testsFor(['2016', '12'], (day, { part1 }) => {
	sample(day, (input) => {
		strictEqual(part1(input), 42);
	});
});

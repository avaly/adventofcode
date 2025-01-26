import { strictEqual } from 'node:assert';

import { cases, sample, testsFor } from '../../utils/tests';
import { isFloorSafe } from './11';

testsFor(['2016', '11'], (day, { part1, part2 }) => {
	// prettier-ignore
	cases( day, [
		[['HYg'], true],
		[['LIc'], true],
		[['HYc', 'LIc'], true],
		[['HYg', 'HYc'], true],
		[['HYg', 'HYc', 'LIg'], true],
		[['HYg', 'HYc', 'LIg', 'LIc'], true],
		[['HYg', 'HYc', 'LIc'], false],
		[['HYg', 'LIc'], false],
	], (input, output) => {
		strictEqual(isFloorSafe(input), output);
	});

	sample(day, (input) => {
		strictEqual(part1(input), 11);
	});

	sample(
		day,
		(input) => {
			strictEqual(part1(input), 7);
		},
		'sample-2',
	);

	sample(
		day,
		(input) => {
			strictEqual(part1(input), 15);
		},
		'sample-3',
	);
});

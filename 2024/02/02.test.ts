import { strictEqual } from 'node:assert';

import { isReportSafe, isReportSafeable } from './02';

import { cases, sample, testsFor } from '../../utils/tests';

testsFor(['2024', '02'], (day, { part1, part2 }) => {
	// prettier-ignore
	cases(
		day,
		[
			[[7, 6, 4, 2, 1], true],
			[[1, 2, 7, 8, 9], false],
		],
		(input, output) => {
			strictEqual(isReportSafe(input), output);
		},
	);

	// prettier-ignore
	cases(
		day,
		[
			[[1, 2, 7, 8, 9], false],
			[[1, 3, 2, 4, 5], true],
		],
		(input, output) => {
			strictEqual(isReportSafeable(input), output);
		},
	);

	sample(day, (input) => {
		strictEqual(part1(input), 2);
		strictEqual(part2(input), 4);
	});
});

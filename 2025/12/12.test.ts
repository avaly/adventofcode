import { strictEqual } from 'node:assert';

import { cases, sample, testsFor } from '../../utils/tests.ts';

testsFor(['2025', '12'], (day, { part1, part2 }) => {
	// // prettier-ignore
	// cases( day, [
	// 	[['foo'], 0],
	// ], (input, output) => {
	// 	strictEqual(part1(input), output);
	// });

	// // prettier-ignore
	// cases(day, [
	//   [['foo'], 0],
	// ], (input, output) => {
	//   // strictEqual(part2(input), output);
	// });

	sample(day, (input) => {
		strictEqual(part1(input), 1);
		// strictEqual(part2(input), 0);
	});
});

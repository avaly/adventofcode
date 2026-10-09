import { strictEqual } from 'node:assert';

import { cases, testsFor } from '../../utils/tests.ts';

testsFor(['2016', '17'], (day, { part1, part2 }) => {
	// prettier-ignore
	cases(
		day,
		[
			[['ihgpwlah'], 'DDRRRD'],
			[['kglvqrro'], 'DDUDRLRRUDRD'],
			[['ulqzkmiv'], 'DRURDRUDDLLDLUURRDULRLDUUDDDRR'],
		],
		(input, output) => {
			strictEqual(part1(input), output);
		},
	);

	// prettier-ignore
	cases(
		day,
		[
			[['ihgpwlah'], 370],
			[['kglvqrro'], 492],
			[['ulqzkmiv'], 830],
		],
		(input, output) => {
			strictEqual(part2(input), output);
		},
	);
});

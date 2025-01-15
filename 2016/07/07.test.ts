import { strictEqual } from 'node:assert';

import { cases, sample, testsFor } from '../../utils/tests';

testsFor(['2016', '07'], (day, { part1, part2 }) => {
	// prettier-ignore
	cases(
		day,
		[
			[['abba[mnop]qrst'], 1],
			[['abcd[bddb]xyyx'], 0],
			[['aaaa[qwer]tyui'], 0],
			[['ioxxoj[asdfgh]zxcvbn'], 1],
		],
		(input, output) => {
			strictEqual(part1(input), output);
		},
	);

	// prettier-ignore
	cases(
		day,
		[
			[['aba[bab]xyz'], 1],
			[['xyx[xyx]xyx'], 0],
			[['aaa[kek]eke'], 1],
			// [['zazbz[bzb]cdb'], 1],
		],
		(input, output) => {
			strictEqual(part2(input), output);
		},
	);
});

import { strictEqual } from 'node:assert';

import { cases, testsFor } from '../../utils/tests';
import { decrypt, Room } from './04';

testsFor(['2016', '04'], (day, { part1, part2 }) => {
	cases(
		day,
		[
			[['aaaaa-bbb-z-y-x-123[abxyz]'], 123],
			[['a-b-c-d-e-f-g-h-987[abcde]'], 987],
			[['not-a-real-room-404[oarel]'], 404],
			[['totally-real-room-200[decoy]'], 0],
		],
		(input, output) => {
			strictEqual(part1(input), output);
		},
	);

	cases(
		day,
		// prettier-ignore
		[
			[['qzmt-zixmtkozy-ivhz', 5, ''] as Room, 'very encrypted name'],
		],
		(input, output) => {
			strictEqual(decrypt(input), output);
		},
	);
});

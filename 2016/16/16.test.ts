import { strictEqual } from 'node:assert';

import { cases, testsFor } from '../../utils/tests.ts';

testsFor(['2016', '16'], (day, program) => {
	const { checksum, part1 } = program as typeof program & {
		checksum: (input: string) => string[];
	};

	// prettier-ignore
	cases(day, [
		['110010110100', '100']
	], (input, output) => {
		strictEqual(checksum(input).join(''), output);
	});

	// prettier-ignore
	cases( day, [
		[['20', '10000'], '01100'],
	], (input, output) => {
		strictEqual(part1(input), output);
	});
});

import { strictEqual } from 'node:assert';

import { cases, testsFor } from '../../utils/tests';

testsFor(['2024', '00'], (day, { part1, part2 }) => {
  cases( day, [
    [['foo'], 'hello foo'],
    [['bar'], 'hello bar'],
  ], (input, output) => {
    strictEqual(part1(input), output);
  });

  cases(day, [
    [['foo'], 'world foo'],
    [['bar'], 'world bar'],
  ], (input, output) => {
    strictEqual(part2(input), output);
  });
});

import { deepStrictEqual, ok } from 'node:assert';
import test, { describe } from 'node:test';
import { generateAllCombinations, generateUniqueCombinations } from './generators';
import { isGeneratorObject } from 'node:util/types';

describe('generators', () => {
	test('all combinations', () => {
		const gen = generateAllCombinations(['a', 'b', 'c', 'd'], [2, 2]);

		ok(isGeneratorObject(gen));

		deepStrictEqual(gen.next().value, ['a', 'b']);
		deepStrictEqual(gen.next().value, ['a', 'c']);
		deepStrictEqual(gen.next().value, ['a', 'd']);
		deepStrictEqual(gen.next().value, ['b', 'a']);
		deepStrictEqual(gen.next().value, ['b', 'c']);
		deepStrictEqual(gen.next().value, ['b', 'd']);
		deepStrictEqual(gen.next().value, ['c', 'a']);
		deepStrictEqual(gen.next().value, ['c', 'b']);
		deepStrictEqual(gen.next().value, ['c', 'd']);
		deepStrictEqual(gen.next().value, ['d', 'a']);
		deepStrictEqual(gen.next().value, ['d', 'b']);
		deepStrictEqual(gen.next().value, ['d', 'c']);

		const result: string[][] = [];

		for (const combo of generateAllCombinations(['a', 'b', 'c'], [1, 2], [])) {
			result.push(combo);
		}

		deepStrictEqual(result, [
			['a'],
			['a', 'b'],
			['a', 'c'],
			['b'],
			['b', 'a'],
			['b', 'c'],
			['c'],
			['c', 'a'],
			['c', 'b'],
		]);
	});

	test('unique combinations', () => {
		const gen = generateUniqueCombinations(['a', 'b', 'c', 'd'], [2, 2]);

		ok(isGeneratorObject(gen));

		deepStrictEqual(gen.next().value, ['a', 'b']);
		deepStrictEqual(gen.next().value, ['a', 'c']);
		deepStrictEqual(gen.next().value, ['a', 'd']);
		deepStrictEqual(gen.next().value, ['b', 'c']);
		deepStrictEqual(gen.next().value, ['b', 'd']);
		deepStrictEqual(gen.next().value, ['c', 'd']);

		const result: string[][] = [];

		for (const combo of generateUniqueCombinations(['a', 'b', 'c', 'd'], [2, 3], [])) {
			result.push(combo);
		}

		deepStrictEqual(result, [
			['a', 'b'],
			['a', 'b', 'c'],
			['a', 'b', 'd'],
			['a', 'c'],
			['a', 'c', 'd'],
			['a', 'd'],
			['b', 'c'],
			['b', 'c', 'd'],
			['b', 'd'],
			['c', 'd'],
		]);
	});
});

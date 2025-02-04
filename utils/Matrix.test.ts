import { deepStrictEqual, strictEqual } from 'node:assert';
import test, { beforeEach, describe } from 'node:test';
import Matrix, { WALL } from './Matrix';
import Coords from './Coords';
import { Coords2D } from './types';

describe('Matrix', () => {
	let matrix: Matrix<number>;

	beforeEach(() => {
		matrix = new Matrix([
			[1, 0, 0, 0],
			[0, 1, 0, 0],
			[0, 0, 1, 0],
		]);
	});

	test('size', () => {
		strictEqual(matrix.sizeX, 4);
		strictEqual(matrix.sizeY, 3);
	});

	test('get cell', () => {
		strictEqual(matrix.get([0, 0]), 1);
		strictEqual(matrix.get([1, 0]), 0);
		strictEqual(matrix.get(Coords.from([1, 1])), 1);
		strictEqual(matrix.getRaw(2, 2), 1);
	});

	test('set cell', () => {
		matrix.set([0, 0], 2);
		matrix.set(Coords.from([1, 1]), 2);
		matrix.setRaw(2, 2, 2);

		strictEqual(matrix.get([0, 0]), 2);
		strictEqual(matrix.get([1, 1]), 2);
		strictEqual(matrix.get([2, 2]), 2);
	});

	test('column', () => {
		deepStrictEqual(matrix.column(0), [1, 0, 0]);
		deepStrictEqual(matrix.column(1), [0, 1, 0]);
	});

	test('row', () => {
		deepStrictEqual(matrix.row(0), [1, 0, 0, 0]);
		deepStrictEqual(matrix.row(1), [0, 1, 0, 0]);
	});

	test('inBounds', () => {
		for (const [pos, expected] of [
			[Coords.raw(-1, 0), false],
			[Coords.raw(0, -1), false],
			[Coords.raw(-1, -1), false],
			[Coords.raw(0, 0), true],
			[Coords.raw(1, 2), true],
			[Coords.raw(2, 0), true],
			[Coords.raw(3, 0), true],
			[Coords.raw(4, 0), false],
			[Coords.raw(0, 3), false],
		] as const) {
			strictEqual(matrix.inBounds(pos), expected);
		}

		for (const [pos, expected] of [
			[[-1, 0], false],
			[[0, -1], false],
			[[-1, -1], false],
			[[0, 0], true],
			[[1, 2], true],
			[[2, 0], true],
			[[3, 0], true],
			[[4, 0], false],
			[[0, 3], false],
		] as const) {
			strictEqual(matrix.inBounds(pos as Coords2D), expected);
		}
	});

	test('combineMatrix', () => {
		const other = Matrix.initialize(matrix.sizeX, matrix.sizeY, 1);

		matrix.combineMatrix(other, (a, b) => a + b);

		strictEqual(matrix.get([0, 0]), 2);
		strictEqual(matrix.get([1, 0]), 1);
	});

	test('iterator', () => {
		const items = [];

		for (const { coords, value } of matrix) {
			items.push(`${coords}=${value}`);
		}

		deepStrictEqual(items, [
			'0x0=1',
			'1x0=0',
			'2x0=0',
			'3x0=0',
			'0x1=0',
			'1x1=1',
			'2x1=0',
			'3x1=0',
			'0x2=0',
			'1x2=0',
			'2x2=1',
			'3x2=0',
		]);
	});

	test('shortest paths', () => {
		// prettier-ignore
		matrix = Matrix.toNumberMatrix([
      '...#.',
      '.#...',
      '.###.',
      '.....',
    ], '', (value) => value === '#' ? WALL : 0);

		Matrix.shortestPaths(matrix, Coords.from([0, 0]));

		strictEqual(matrix.get([0, 0]), 1);
		strictEqual(matrix.get([1, 0]), 2);
		strictEqual(matrix.get([2, 1]), 4);
		strictEqual(matrix.get([4, 1]), 6);
		strictEqual(matrix.get([4, 3]), 8);
	});
});

import { strictEqual } from 'node:assert';
import test, { beforeEach, describe } from 'node:test';
import Coords from './Coords';
import Matrix from './Matrix';

describe('Coords', () => {
	var pos: Coords;

	beforeEach(() => {
		pos = Coords.raw(1, 2);
	});

	test('add', () => {
		pos.add(Coords.raw(10, 5));

		strictEqual(pos.x, 11);
		strictEqual(pos.y, 7);

		pos.add([0, 1]);

		strictEqual(pos.x, 11);
		strictEqual(pos.y, 8);

		const newPos = Coords.add(Coords.raw(1, 2), Coords.raw(10, 5));

		strictEqual(newPos.x, 11);
		strictEqual(newPos.y, 7);
	});

	test('minus', () => {
		pos.minus(Coords.raw(10, 5));

		strictEqual(pos.x, -9);
		strictEqual(pos.y, -3);

		const newPos = Coords.minus(Coords.raw(1, 2), Coords.raw(2, 5));

		strictEqual(newPos.x, -1);
		strictEqual(newPos.y, -3);
	});

	test('neighbors', () => {
		for (const [pos, expected] of [
			[Coords.raw(0, 0), '0x-1,1x0,0x1,-1x0'],
			[Coords.raw(1, 2), '1x1,2x2,1x3,0x2'],
		] as const) {
			strictEqual(pos.neighbors().join(','), expected);
		}

		const matrix = Matrix.initialize(3, 3, 0);

		for (const [pos, expected] of [
			[Coords.raw(0, 0), '1x0,0x1'],
			[Coords.raw(1, 1), '1x0,2x1,1x2,0x1'],
			[Coords.raw(2, 2), '2x1,1x2'],
		] as const) {
			strictEqual(pos.neighbors(matrix).join(','), expected);
		}
	});

	test('negative', () => {
		pos.negative();

		strictEqual(pos.x, -1);
		strictEqual(pos.y, -2);

		const newPos = Coords.negative(Coords.raw(1, 2));

		strictEqual(newPos.x, -1);
		strictEqual(newPos.y, -2);
	});

	test('wrap', () => {
		const max = Coords.raw(3, 3);
		const matrix = Matrix.initialize(3, 3, 0);

		for (const [pos, bounds, expectedX, expectedY] of [
			[Coords.raw(1, 2), max, 1, 2],
			[Coords.raw(3, 3), max, 0, 0],
			[Coords.raw(4, 5), max, 1, 2],
			[Coords.raw(-1, -2), max, 2, 1],
			[Coords.raw(1, 2), matrix, 1, 2],
			[Coords.raw(3, 3), matrix, 0, 0],
			[Coords.raw(4, 5), matrix, 1, 2],
			[Coords.raw(-1, -2), matrix, 2, 1],
		] as const) {
			pos.wrap(bounds);

			strictEqual(pos.x, expectedX);
			strictEqual(pos.y, expectedY);
		}
	});
});

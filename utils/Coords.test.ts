import { strictEqual } from 'node:assert';
import test, { beforeEach, describe } from 'node:test';
import Coords from './Coords';

describe('Coords', () => {
	var pos: Coords;

	beforeEach(() => {
		pos = Coords.raw(1, 2);
	});

	test('add', () => {
		pos.add(Coords.raw(10, 5));

		strictEqual(pos.x, 11);
		strictEqual(pos.y, 7);
	});

	test('minus', () => {
		pos.minus(Coords.raw(10, 5));

		strictEqual(pos.x, -9);
		strictEqual(pos.y, -3);
	});

	test('negative', () => {
		pos.negative();

		strictEqual(pos.x, -1);
		strictEqual(pos.y, -2);
	});

	test('wrap', () => {
		for (const [pos, bounds, expectedX, expectedY] of [
			[Coords.raw(1, 2), Coords.raw(3, 3), 1, 2],
			[Coords.raw(3, 3), Coords.raw(3, 3), 0, 0],
			[Coords.raw(4, 5), Coords.raw(3, 3), 1, 2],
			[Coords.raw(-1, -2), Coords.raw(3, 3), 2, 1],
		] as const) {
			pos.wrap(bounds);

			strictEqual(pos.x, expectedX);
			strictEqual(pos.y, expectedY);
		}
	});
});

import { ORIENTATIONS, OrientationVector2D } from './constants';
import Matrix from './Matrix';
import { Orientation, Vector2D } from './types';

export default class Coords {
	x: number;
	y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	static add(one: Coords, two: Coords | Vector2D) {
		if (two instanceof Coords) {
			return Coords.raw(one.x + two.x, one.y + two.y);
		}
		return Coords.raw(one.x + two[0], one.y + two[1]);
	}

	static from([x, y]: [number, number]) {
		return new Coords(x, y);
	}

	static minus(one: Coords, two: Coords | Vector2D) {
		if (two instanceof Coords) {
			return Coords.raw(one.x - two.x, one.y - two.y);
		}
		return Coords.raw(one.x - two[0], one.y - two[1]);
	}

	static negative(item: Coords) {
		return Coords.raw(-item.x, -item.y);
	}

	static raw(x: number, y: number) {
		return new Coords(x, y);
	}

	add(other: Coords | Vector2D) {
		if (other instanceof Coords) {
			this.x += other.x;
			this.y += other.y;
		} else {
			this.x += other[0];
			this.y += other[1];
		}
	}

	equal(other: Coords): boolean {
		return this.x === other.x && this.y === other.y;
	}

	minus(other: Coords) {
		this.x -= other.x;
		this.y -= other.y;
	}

	negative() {
		this.x = -this.x;
		this.y = -this.y;
	}

	neighbors(matrix?: Matrix<unknown>): (readonly [Coords, Orientation])[] {
		return ORIENTATIONS.map(
			(orientation) => [Coords.add(this, OrientationVector2D[orientation]), orientation] as const,
		).filter(([neighbor]) => (matrix ? matrix.inBounds(neighbor) : true));
	}

	toString() {
		return `${this.x}x${this.y}`;
	}

	wrap(bounds: Matrix<unknown> | Coords) {
		const maxX = bounds instanceof Matrix ? bounds.sizeX : bounds.x;
		const maxY = bounds instanceof Matrix ? bounds.sizeY : bounds.y;

		if (this.x < 0) {
			this.x += maxX;
		}
		if (this.x > maxX - 1) {
			this.x -= maxX;
		}

		if (this.y < 0) {
			this.y += maxY;
		}
		if (this.y > maxY - 1) {
			this.y -= maxY;
		}
	}
}

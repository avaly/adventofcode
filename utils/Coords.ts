import { Vector2D } from './types';

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

	static raw(x: number, y: number) {
		return new Coords(x, y);
	}

	addVector2D(vector: Vector2D) {
		this.x += vector[0];
		this.y += vector[1];
	}

	add(other: Coords) {
		this.x += other.x;
		this.y += other.y;
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

	toString() {
		return `${this.x}x${this.y}`;
	}

	wrap(bounds: Coords) {
		if (this.x < 0) {
			this.x += bounds.x;
		}
		if (this.x > bounds.x - 1) {
			this.x -= bounds.x;
		}

		if (this.y < 0) {
			this.y += bounds.y;
		}
		if (this.y > bounds.y - 1) {
			this.y -= bounds.y;
		}
	}
}

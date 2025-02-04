import Coords from './Coords';
import { Coords2D } from './types';

export const NUMBER_PRINTER = (value: number) =>
	value === WALL ? '#' : value === 0 ? '.' : String(value);

export const WALL = Infinity;

export default class Matrix<T> {
	data: T[][];

	constructor(data: T[][]) {
		this.data = data;
	}

	*[Symbol.iterator]() {
		for (let y = 0; y < this.sizeY; y++) {
			for (let x = 0; x < this.sizeX; x++) {
				yield {
					coords: Coords.from([x, y]),
					position: [x, y] as Coords2D,
					value: this.data[y][x],
				};
			}
		}
	}

	get sizeY() {
		return this.data.length;
	}

	get sizeX() {
		return this.data[0]?.length || 0;
	}

	column(x: number): T[] {
		let items = [];
		for (let y = 0; y < this.sizeY; y++) {
			items.push(this.data[y][x]);
		}
		return items;
	}

	combineMatrix(other: Matrix<T>, operation: (a: T, b: T) => T): void {
		for (const { position, value } of this) {
			this.set(position, operation(value, other.get(position)));
		}
	}

	get(coords: Coords2D | Coords): T {
		if (coords instanceof Coords) {
			return this.data[coords.y][coords.x];
		}
		return this.data[coords[1]][coords[0]];
	}

	getRaw(x: number, y: number): T {
		return this.data[y][x];
	}

	inBounds(pos: Coords2D | Coords): boolean {
		if (pos instanceof Coords) {
			return pos.x >= 0 && pos.x < this.sizeX && pos.y >= 0 && pos.y < this.sizeY;
		}
		return pos[0] >= 0 && pos[0] < this.sizeX && pos[1] >= 0 && pos[1] < this.sizeY;
	}

	print(itemWidth = 3, printer: (value: T) => string = String, axes = true) {
		if (axes) {
			console.log(
				' '.padStart(itemWidth + 2) +
					Array.from('x'.repeat(this.sizeX))
						.map((_, index) => String(index).padStart(itemWidth))
						.join(''),
			);
			console.log('-'.repeat(itemWidth * (this.sizeX + 1) + 2));
		}

		for (const [index, line] of this.data.entries()) {
			const items = line.map((item) => printer(item).padStart(itemWidth)).join('');
			console.log(axes ? `${String(index).padStart(itemWidth)} |${items}` : items);
		}

		if (axes) {
			console.log('-'.repeat(itemWidth * (this.sizeX + 1) + 2));
		}
	}

	row(y: number): T[] {
		return [...this.data[y]];
	}

	set(coords: Coords2D | Coords, value: T): void {
		if (coords instanceof Coords) {
			this.data[coords.y][coords.x] = value;
		} else {
			this.data[coords[1]][coords[0]] = value;
		}
	}

	setRaw(x: number, y: number, value: T): void {
		this.data[y][x] = value;
	}

	static clone<T>(value: Matrix<T>): Matrix<T> {
		return new Matrix(JSON.parse(JSON.stringify(value.data)));
	}

	static initialize<T>(sizeX: number, sizeY: number, value: T): Matrix<T> {
		const data = [];

		for (let y = 0; y < sizeY; y++) {
			data.push([]);
			for (let x = 0; x < sizeX; x++) {
				data[y].push(value);
			}
		}

		return new Matrix(data);
	}

	static shortestPaths(map: Matrix<number>, start: Coords, wall = WALL) {
		const queue: [Coords, number][] = [[start, 1]];

		while (queue.length) {
			const [current, cost] = queue.shift();

			if (!map.inBounds(current) || map.get(current) === wall) {
				continue;
			}

			map.set(current, cost);

			for (const [neighbor] of current.neighbors(map)) {
				if (neighbor.equal(start)) {
					continue;
				}

				const value = map.get(neighbor);
				if (value === WALL) {
					continue;
				}
				if (value > 0 && value <= cost + 1) {
					continue;
				}

				queue.push([neighbor, cost + 1]);
			}
		}
	}

	static toNumberMatrix(
		input: string[],
		separator = '',
		valueMapper: (value: string, position: Coords2D) => number = Number,
	): Matrix<number> {
		return new Matrix(
			input.map((line, y) => line.split(separator).map((value, x) => valueMapper(value, [x, y]))),
		);
	}

	static toStringMatrix(input: string[], separator = ''): Matrix<string> {
		return new Matrix(input.map((line) => line.split(separator)));
	}
}

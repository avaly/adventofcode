import { Coords2D } from './types';

export default class Matrix<T> {
	data: T[][];

	constructor(data: T[][]) {
		this.data = data;
	}

	get sizeY() {
		return this.data.length;
	}

	get sizeX() {
		return this.data[0]?.length || 0;
	}

	get(coords: Coords2D): T {
		return this.data[coords[1]][coords[0]];
	}

	getRaw(x: number, y: number): T {
		return this.data[y][x];
	}

	inBounds(pos: Coords2D): boolean {
		return pos[0] >= 0 && pos[0] < this.sizeX && pos[1] >= 0 && pos[1] < this.sizeY;
	}

	print(itemWidth = 3) {
		console.log(
			' '.padStart(itemWidth + 2) +
				Array.from('x'.repeat(this.sizeX))
					.map((_, index) => String(index).padStart(itemWidth))
					.join(''),
		);
		console.log('-'.repeat(itemWidth * (this.sizeX + 1) + 2));

		for (const [index, line] of this.data.entries()) {
			const items = line.map((item) => String(item).padStart(itemWidth)).join('');
			console.log(`${String(index).padStart(itemWidth)} |${items}`);
		}

		console.log('-'.repeat(itemWidth * (this.sizeX + 1) + 2));
	}

	set(coords: Coords2D, value: T): void {
		this.data[coords[1]][coords[0]] = value;
	}

	setRaw(x: number, y: number, value: T): void {
		this.data[y][x] = value;
	}

	static clone<T>(value: Matrix<T>): Matrix<T> {
		return new Matrix(JSON.parse(JSON.stringify(value.data)));
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

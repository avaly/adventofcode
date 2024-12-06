import { Coords2D, Day, Matrix, Orientation, Program, Vector2D, VectorDelta } from './types';

export function addPositionVector2D(pos: Coords2D, vector: Vector2D): Coords2D {
	return [pos[0] + vector[0], pos[1] + vector[1]];
}

export async function loadProgram([year, day]: Day): Promise<Program> {
	const implementation = await import(`../${year}/${day}/${day}.ts`);

	return implementation;
}

export function negativeVector(vectorDelta: VectorDelta): VectorDelta {
	return -vectorDelta as VectorDelta;
}

export function printMatrix<T>(matrix: Matrix<T>, itemWidth = 3) {
	const sizeX = matrix[0].length;

	console.log(
		' '.padStart(itemWidth + 2) +
			Array.from('x'.repeat(sizeX))
				.map((_, index) => String(index).padStart(itemWidth))
				.join(''),
	);
	console.log('-'.repeat(itemWidth * (sizeX + 1) + 2));

	for (const [index, line] of matrix.entries()) {
		const items = line.map((item) => String(item).padStart(itemWidth)).join('');
		console.log(`${String(index).padStart(itemWidth)} |${items}`);
	}

	console.log('-'.repeat(itemWidth * (sizeX + 1) + 2));
}

export function readCharMatrix(input: string[], separator = ''): Matrix<string> {
	return input.map((line) => line.split(separator));
}

export function readNumberMatrix(
	input: string[],
	separator = '',
	valueMapper: (value: string, position: Coords2D) => number = Number,
): Matrix<number> {
	return input.map((line, y) =>
		line.split(separator).map((value, x) => valueMapper(value, [x, y])),
	);
}

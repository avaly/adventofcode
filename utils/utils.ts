import { Day, Matrix, Program, VectorDelta } from './types';

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

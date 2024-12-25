import Matrix from '../../utils/Matrix';

export type Device = [number, number, number, number, number];
type Data = {
	keys: Device[];
	locks: Device[];
};

function parse(input: string[]): Data {
	const locks = [];
	const keys = [];

	const matrixes = input.join('\n').split('\n\n');
	for (const matrixInput of matrixes) {
		const matrix = Matrix.toStringMatrix(matrixInput.split('\n'));
		const device = [0, 0, 0, 0, 0];

		for (let x = 0; x < matrix.sizeX; x++) {
			device[x] = matrix.data.reduce((acc, line) => acc + (line[x] === '#' ? 1 : 0), 0) - 1;
		}

		if (matrix.data[0].join('') === '.....') {
			keys.push(device);
		} else {
			locks.push(device);
		}
	}

	return { keys, locks };
}

export function matches(key: Device, lock: Device): boolean {
	for (let i = 0; i < 5; i++) {
		if (key[i] + lock[i] > 5) {
			return false;
		}
	}
	return true;
}

export function part1(input: string[]): number {
	let result = 0;

	const { keys, locks } = parse(input);

	for (const lock of locks) {
		for (const key of keys) {
			if (matches(key, lock)) {
				result++;
			}
		}
	}

	return result;
}

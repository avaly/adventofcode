import Matrix from '../../utils/Matrix.ts';

type Shape = Matrix<number>;
type Section = {
	size: [number, number];
	shapes: number[];
};
type Data = {
	shapes: Shape[];
	sections: Section[];
};

function parse(input: string[]): Data {
	const shapes: Shape[] = [];
	const sections: Section[] = [];

	for (let i = 0; i < 5; i++) {
		const shape = new Matrix(
			input
				.slice(i * 5 + 1, i * 5 + 4)
				.map((line) => line.split('').map((c) => (c === '#' ? 1 : 0))),
		);

		shapes.push(shape);
	}

	for (const line of input.slice(30)) {
		const [sizePart, shapesPart] = line.split(':');
		const [sizeX, sizeY] = sizePart.split('x').map(Number);
		const shapeCounts = shapesPart.split(' ').map((s) => Number(s.trim()));
		sections.push({
			size: [sizeX, sizeY],
			shapes: shapeCounts,
		});
	}

	return { shapes, sections };
}

function solve(data: Data): number {
	return data.sections.reduce((acc, section) => {
		const sectionArea = section.size[0] * section.size[1];
		const shapesArea = section.shapes.reduce((sum, count, index) => {
			return sum + 9 * count;
		}, 0);

		return acc + (sectionArea >= shapesArea ? 1 : 0);
	}, 0);
}

export function part1(input: string[]): number {
	return solve(parse(input));
}

export function part2(input: string[]): number {
	return 0;
}

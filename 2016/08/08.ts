import Coords from '../../utils/Coords';
import Matrix from '../../utils/Matrix';

type Rect = Coords;
type RotateColumn = ['x', number, number];
type RotateRow = ['y', number, number];

type Move = Rect | RotateColumn | RotateRow;

type Data = Move[];

function parse(input: string[]): Data {
	const data: Move[] = [];

	for (const line of input) {
		const matchRect = /rect (\d+)x(\d+)/.exec(line);
		if (matchRect) {
			data.push(Coords.from(matchRect.slice(1, 3).map(Number) as [number, number]));
		} else {
			const matchRotate = /rotate (column|row) (x|y)=(\d+) by (\d+)/.exec(line);
			if (matchRotate) {
				data.push([
					matchRotate[2] as 'x' | 'y',
					...(matchRotate.slice(3, 5).map(Number) as [number, number]),
				]);
			}
		}
	}

	return data;
}

function solve(data: Data): number {
	const screen = Matrix.initialize(50, 6, 0);

	for (const move of data) {
		if (move instanceof Coords) {
			for (let x = 0; x < move.x; x++) {
				for (let y = 0; y < move.y; y++) {
					screen.setRaw(x, y, 1);
				}
			}
		} else if (move[0] === 'x') {
			const column = screen.column(move[1]);
			for (let y = 0; y < screen.sizeY; y++) {
				screen.setRaw(move[1], y, column[(y - move[2] + screen.sizeY) % screen.sizeY]);
			}
		} else if (move[0] === 'y') {
			const row = screen.row(move[1]);
			for (let x = 0; x < screen.sizeX; x++) {
				screen.setRaw(x, move[1], row[(x - move[2] + screen.sizeX) % screen.sizeX]);
			}
		}
	}

	screen.print(1, (value) => (value ? '#' : ' '), false);

	return screen.data.reduce((acc, row) => acc + row.reduce((acc2, value) => acc2 + value, 0), 0);
}

export function part1(input: string[]): number {
	return solve(parse(input));
}

export function part2(input: string[]): string {
	return '';
}

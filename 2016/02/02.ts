import { MoveLetterOrientation, OrientationVector2D } from '../../utils/constants';
import Coords from '../../utils/Coords';
import Matrix from '../../utils/Matrix';
import { Orientation } from '../../utils/types';

type Data = Orientation[][];

function parse(input: string[]): Data {
	const commands: Orientation[][] = [];

	for (const line of input) {
		commands.push(line.split('').map((letter) => MoveLetterOrientation[letter]));
	}

	return commands;
}

function solve(data: Data, buttons: Matrix<string>): string {
	let current = new Coords(1, 1);

	for (const { position, value } of buttons) {
		if (value === '5') {
			current = Coords.from(position);
		}
	}

	let result = '';

	for (const commands of data) {
		for (const orientation of commands) {
			const next = Coords.add(current, OrientationVector2D[orientation]);
			if (buttons.inBounds(next) && buttons.get(next) !== '') {
				current = next;
			}
		}
		result += buttons.get(current);
	}

	return result;
}

export function part1(input: string[]): string {
	const buttons = Matrix.toStringMatrix(
		// prettier-ignore
		[
			'1 2 3',
			'4 5 6',
			'7 8 9'
		],
		' ',
	);

	return solve(parse(input), buttons);
}

export function part2(input: string[]): string {
	const buttons = Matrix.toStringMatrix(
		// prettier-ignore
		[
			  '  1  ',
			 ' 2 3 4 ',
			'5 6 7 8 9',
			 ' A B C ',
			  '  D  '
		],
		' ',
	);

	return solve(parse(input), buttons);
}

import { Coords2D, Day, Program, Vector2D, VectorDelta } from './types';

export function addCoordsVector2D(pos: Coords2D, vector: Vector2D): Coords2D {
	return [pos[0] + vector[0], pos[1] + vector[1]];
}

export function addCoords2D(pos1: Coords2D, pos2: Coords2D): Coords2D {
	return [pos1[0] + pos2[0], pos1[1] + pos2[1]];
}

export function cloneArray<T>(list: Array<T>): Array<T> {
	return list.toSpliced(list.length);
}

export function decodeCoords2D(value: string): Coords2D {
	return value.split('x').map(Number) as Coords2D;
}

export function diffCoords2D(pos1: Coords2D, pos2: Coords2D): Coords2D {
	return [pos1[0] - pos2[0], pos1[1] - pos2[1]];
}

export function encodeCoords2D(pos: Coords2D): string {
	return pos.join('x');
}

export async function loadProgram([year, day]: Day): Promise<Program> {
	const implementation = await import(`../${year}/${day}/${day}.ts`);

	return implementation;
}

export function negativeCoords2D(pos: Coords2D): Coords2D {
	return [-pos[0], -pos[1]];
}

export function negativeVector(vectorDelta: VectorDelta): VectorDelta {
	return -vectorDelta as VectorDelta;
}

export async function pause(delay: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, delay));
}

export function edgePrinter(value: number): string {
	return (
		{
			0: '.',
			1: '┯',
			2: '┨',
			3: '┓',
			4: '┷',
			5: '=',
			6: '┛',
			7: '⊐',
			8: '┠',
			9: '┏',
			10: '∥',
			11: '⊓',
			12: '┗',
			13: '⊏',
			14: '⊔',
			15: '□',
		}[value] || String(value)
	);
}

export function wrapCoords2D(position: Coords2D, size: Coords2D): Coords2D {
	let [x, y] = position;

	if (x < 0) {
		x += size[0];
	}
	if (x > size[0] - 1) {
		x -= size[0];
	}

	if (y < 0) {
		y += size[1];
	}
	if (y > size[1] - 1) {
		y -= size[1];
	}

	return [x, y];
}

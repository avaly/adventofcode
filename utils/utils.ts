import { Coords2D, Day, Program, Vector2D, VectorDelta } from './types';

export function addPositionVector2D(pos: Coords2D, vector: Vector2D): Coords2D {
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

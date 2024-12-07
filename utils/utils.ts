import { Coords2D, Day, Program, Vector2D, VectorDelta } from './types';

export function addPositionVector2D(pos: Coords2D, vector: Vector2D): Coords2D {
	return [pos[0] + vector[0], pos[1] + vector[1]];
}

export function cloneArray<T>(list: Array<T>): Array<T> {
	return list.toSpliced(list.length);
}

export async function loadProgram([year, day]: Day): Promise<Program> {
	const implementation = await import(`../${year}/${day}/${day}.ts`);

	return implementation;
}

export function negativeVector(vectorDelta: VectorDelta): VectorDelta {
	return -vectorDelta as VectorDelta;
}

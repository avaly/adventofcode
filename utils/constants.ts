import { Move, Orientation, Vector2D } from './types';

export const MoveVector2D: Record<Move, Vector2D> = {
	'^': [0, -1],
	'>': [1, 0],
	v: [0, 1],
	'<': [-1, 0],
};

export const ORIENTATION_BITS = {
	north: 0,
	east: 1,
	south: 2,
	west: 3,
};

export const ORIENTATIONS: Orientation[] = ['east', 'west', 'north', 'south'];

export const OrientationLeft: Record<Orientation, Orientation> = {
	north: 'west',
	east: 'north',
	south: 'east',
	west: 'south',
};

export const OrientationRight: Record<Orientation, Orientation> = {
	north: 'east',
	east: 'south',
	south: 'west',
	west: 'north',
};

export const OrientationMove: Record<Orientation, Move> = {
	north: '^',
	east: '>',
	south: 'v',
	west: '<',
};

export const OrientationVector2D: Record<Orientation, Vector2D> = {
	north: [0, -1],
	east: [1, 0],
	south: [0, 1],
	west: [-1, 0],
};

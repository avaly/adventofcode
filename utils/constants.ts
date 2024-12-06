import { Orientation, Vector2D } from './types';

export const OrientationRight: Record<Orientation, Orientation> = {
	north: 'east',
	east: 'south',
	south: 'west',
	west: 'north',
};

export const OrientationVector2D: Record<Orientation, Vector2D> = {
	north: [0, -1],
	east: [1, 0],
	south: [0, 1],
	west: [-1, 0],
};

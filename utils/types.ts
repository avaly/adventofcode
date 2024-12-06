export type Coords2D = [number, number];
export type Coords3D = [number, number, number];

export type Day = [string, string];

export type Matrix<T> = T[][];

export type Program<Input = string[], Output = number> = {
	part1: (input: Input) => Output;
	part2: (input: Input) => Output;
};

export type VectorDelta = -1 | 0 | 1;

export type Vector2D = [VectorDelta, VectorDelta];
export type Vector3D = [VectorDelta, VectorDelta, VectorDelta];

export type Orientation = 'north' | 'east' | 'south' | 'west';

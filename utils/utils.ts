import { Day, Program } from './types';

export async function loadProgram([year, day]: Day): Promise<Program> {
	const { part1, part2 } = await import(`../${year}/${day}/${day}.ts`);

	return { part1, part2 };
}

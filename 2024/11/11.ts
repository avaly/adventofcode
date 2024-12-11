type Stones = number[];

const cache: Record<number, Record<number, number>> = {};

export function parse(input: string[]): Stones {
	return input[0].split(' ').map(Number);
}

function blinkOnce(stones: Stones): Stones {
	const final = [...stones];
	let i = 0;

	while (i < final.length) {
		const stone = final[i];

		if (final[i] === 0) {
			final[i] = 1;
			i++;
		} else if (String(stone).length % 2 === 0) {
			const stoneStr = String(stone);
			final[i] = parseInt(stoneStr.substring(0, stoneStr.length / 2), 10);
			final.splice(i + 1, 0, parseInt(stoneStr.substring(stoneStr.length / 2), 10));
			i += 2;
		} else {
			final[i] *= 2024;
			i++;
		}
	}

	return final;
}

function blinkStone(stone: number, blinks: number): number {
	if (!blinks) {
		return 1;
	}

	if (cache[stone]?.[blinks]) {
		return cache[stone][blinks];
	}

	let result = 0;

	const blinked = blinkOnce([stone]);

	for (const newStone of blinked) {
		result += blinkStone(newStone, blinks - 1);
	}

	(cache[stone] ||= [])[blinks] = result;

	return result;
}

export function solve(stones: Stones, blinks: number) {
	let total = 0;

	for (const stone of stones) {
		total += blinkStone(stone, blinks);
	}

	return total;
}

export function part1(input: string[]): number {
	const stones = parse(input);

	return solve(stones, 25);
}

export function part2(input: string[]): number {
	const stones = parse(input);

	return solve(stones, 75);
}

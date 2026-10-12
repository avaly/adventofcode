type Operation =
	| {
			from: number;
			to: number;
			type: 'move';
	  }
	| {
			from: number;
			to: number;
			type: 'reverse';
	  }
	| {
			direction: 'left' | 'right';
			steps: number;
			type: 'rotate-all';
	  }
	| {
			letter: string;
			type: 'rotate-letter';
	  }
	| {
			from: number;
			to: number;
			type: 'swap-position';
	  }
	| {
			from: string;
			to: string;
			type: 'swap-letter';
	  };

type Data = {
	initial: string;
	operations: Operation[];
};

const ROTATE_LETTER_BACKWARDS = [1, 1, 6, 2, 7, 3, 0, 4];

function parse(input: string[], part2 = false): Data {
	const data: Data = {
		initial: input[0],
		operations: [],
	};

	for (const line of input.slice(1)) {
		const matchSwap = /^swap (letter|position) ([^\s]+) with .+ ([^\s]+)$/.exec(line);
		if (matchSwap) {
			const type = matchSwap[1] as 'position' | 'letter';
			if (type === 'position') {
				data.operations.push({
					from: parseInt(matchSwap[2], 10),
					to: parseInt(matchSwap[3], 10),
					type: 'swap-position',
				});
			} else {
				data.operations.push({
					from: matchSwap[2],
					to: matchSwap[3],
					type: 'swap-letter',
				});
			}
			continue;
		}

		const matchRotateAll = /^rotate (left|right) (\d+) steps?$/.exec(line);
		if (matchRotateAll) {
			data.operations.push({
				direction: matchRotateAll[1] as 'left' | 'right',
				steps: parseInt(matchRotateAll[2], 10),
				type: 'rotate-all',
			});
			continue;
		}

		const matchRotateLetter = /^rotate based on position of letter ([^\s])$/.exec(line);
		if (matchRotateLetter) {
			data.operations.push({
				letter: matchRotateLetter[1],
				type: 'rotate-letter',
			});
			continue;
		}

		const matchReverse = /^reverse positions (\d+) through (\d+)$/.exec(line);
		if (matchReverse) {
			data.operations.push({
				from: parseInt(matchReverse[1], 10),
				to: parseInt(matchReverse[2], 10),
				type: 'reverse',
			});
			continue;
		}

		const matchMove = /^move position (\d+) to position (\d+)$/.exec(line);
		if (matchMove) {
			data.operations.push({
				from: parseInt(matchMove[1], 10),
				to: parseInt(matchMove[2], 10),
				type: 'move',
			});
			continue;
		}

		throw new Error(`Unknown operation: ${line}`);
	}

	if (part2) {
		data.initial = 'fbgdceah';
		data.operations = data.operations.reverse();
	}

	return data;
}

function swapLetter(input: string[], from: string, to: string): string[] {
	return input.map((value) => (value === from ? to : value === to ? from : value));
}

function rotate(input: string[], direction: 'left' | 'right', steps: number): string[] {
	if (direction === 'left') {
		const prefix = input.slice(0, steps);
		return [...input.slice(steps), ...prefix];
	} else {
		const suffix = input.slice(input.length - steps);
		return [...suffix, ...input.slice(0, input.length - steps)];
	}
}

function solve({ initial, operations }: Data, part2: boolean = false): string {
	let current = initial.split('');

	for (const operation of operations) {
		switch (operation.type) {
			case 'move':
				const moveFirst = current.splice(part2 ? operation.to : operation.from, 1);
				current.splice(part2 ? operation.from : operation.to, 0, moveFirst[0]);
				break;

			case 'rotate-all':
				current = rotate(
					current,
					part2 ? (operation.direction === 'left' ? 'right' : 'left') : operation.direction,
					operation.steps,
				);
				break;

			case 'rotate-letter':
				const index = current.findIndex((value) => value === operation.letter);
				const steps = part2 ? ROTATE_LETTER_BACKWARDS[index] : index + 1 + (index >= 4 ? 1 : 0);

				current = rotate(current, part2 ? 'left' : 'right', steps);
				break;

			case 'reverse':
				current = [
					...current.slice(0, Math.max(0, operation.from)),
					...current.slice(operation.from, operation.to + 1).reverse(),
					...current.slice(operation.to + 1),
				];
				break;

			case 'swap-letter':
				current = swapLetter(current, operation.from, operation.to);
				break;

			case 'swap-position':
				const swapFirst = current[operation.from];
				const swapSecond = current[operation.to];
				current = swapLetter(current, swapFirst, swapSecond);
				break;

			default:
				console.log('Unknown', operation);
		}
	}

	return current.join('');
}

export function part1(input: string[]): string {
	return solve(parse(input));
}

export function part2(input: string[]): string {
	return solve(parse(input, true), true);
}

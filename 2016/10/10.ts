type Recipient = 'bot' | 'output';
type Bot = {
	chips: [number, number];
	output: [[Recipient, number], [Recipient, number]];
};
type Data = {
	bots: Bot[];
	operations: [number, number][];
	outputs: number[];
};

function parse(input: string[]): Data {
	const data: Data = {
		bots: [],
		operations: [],
		outputs: [],
	};
	let match;

	for (const line of input) {
		if ((match = /value (\d+) goes to bot (\d+)/.exec(line))) {
			data.operations.push([parseInt(match[2], 10), parseInt(match[1], 10)] as const);
		}
		if (
			(match = /bot (\d+) gives low to (bot|output) (\d+) and high to (bot|output) (\d+)/.exec(
				line,
			))
		) {
			const botID = parseInt(match[1], 10);

			if (!data.bots[botID]) {
				data.bots[botID] = {
					chips: [0, 0],
					output: [
						['bot', 0],
						['bot', 0],
					],
				};
			}

			data.bots[botID].output[0][0] = match[4];
			data.bots[botID].output[0][1] = parseInt(match[5], 10);
			data.bots[botID].output[1][0] = match[2];
			data.bots[botID].output[1][1] = parseInt(match[3], 10);
		}
	}

	return data;
}

function solve(data: Data, part2: boolean = false): number {
	const { bots, operations, outputs } = data;

	let op = 0;

	while (op < operations.length) {
		const [botID, value] = operations[op];

		const bot = bots[botID];

		const chips = [...bot.chips, value].toSorted((a, b) => b - a).slice(0, 2) as [number, number];

		bot.chips = chips;

		if (chips[1] > 0) {
			for (let i = 0; i < 2; i++) {
				if (bot.output[i][0] === 'bot') {
					operations.push([bot.output[i][1], bot.chips[i]]);
				} else {
					outputs[bot.output[i][1]] = bot.chips[i];
				}
			}
		}

		op++;
	}

	const search = process.env.NODE_ENV === 'test' ? [5, 2] : [61, 17];

	return part2
		? outputs.slice(0, 3).reduce((acc, value) => acc * value, 1)
		: bots.findIndex((bot) => bot.chips.join(',') === search.join(','));
}

export function part1(input: string[]): number {
	return solve(parse(input));
}

export function part2(input: string[]): number {
	return solve(parse(input), true);
}

type Registers = [number, number, number];

export type Data = {
	output: number[];
	program: (0 | 1 | 2 | 3 | 4 | 5 | 6 | 7)[];
	registers: Registers;
};

function parse(input: string[]): Data {
	const result: Data = {
		output: [],
		program: [],
		registers: [0, 0, 0],
	};

	for (const line of input) {
		if (!line.length) {
			continue;
		}
		const matchRegister = /Register ([A-C]): (\d+)/.exec(line);
		if (matchRegister?.[2]) {
			result.registers[matchRegister[1].charCodeAt(0) - 'A'.charCodeAt(0)] = parseInt(
				matchRegister[2],
				10,
			);
		} else {
			// @ts-expect-error Ignore number type
			result.program = line.replace('Program: ', '').split(',').map(Number);
		}
	}

	return result;
}

// JS supports 64-bit numbers, but does bit operations on 32-bit numbers only
// https://stackoverflow.com/questions/72624005/bitwise-xor-in-javascript-with-a-64-bit-integer
function xor(v1: number, v2: number): number {
	var hi = 0x80000000;
	var low = 0x7fffffff;
	var hi1 = ~~(v1 / hi);
	var hi2 = ~~(v2 / hi);
	var low1 = v1 & low;
	var low2 = v2 & low;
	var h = hi1 ^ hi2;
	var l = low1 ^ low2;

	return h * hi + l;
}

function getOperand(operand: number, registers: number[]): number {
	if (operand >= 0 && operand <= 3) {
		return operand;
	}
	return registers[operand - 4];
}

function executeOperation(
	{ output, registers }: Data,
	opcode: number,
	operand: number,
	index: number,
) {
	const value = getOperand(operand, registers);

	switch (opcode) {
		// The adv instruction (opcode 0) performs division. The numerator is the value in the A register. The denominator is found by raising 2 to the power of the instruction's combo operand. (So, an operand of 2 would divide A by 4 (2^2); an operand of 5 would divide A by 2^B.) The result of the division operation is truncated to an integer and then written to the A register.
		case 0:
			registers[0] = Math.floor(registers[0] / Math.pow(2, value));
			break;

		// The bxl instruction (opcode 1) calculates the bitwise XOR of register B and the instruction's literal operand, then stores the result in register B.
		case 1:
			registers[1] = xor(registers[1], operand);
			break;

		// The bst instruction (opcode 2) calculates the value of its combo operand modulo 8 (thereby keeping only its lowest 3 bits), then writes that value to the B register.
		case 2:
			// Handle >32 bit numbers
			registers[1] = value & 7;
			break;

		// The jnz instruction (opcode 3) does nothing if the A register is 0. However, if the A register is not zero, it jumps by setting the instruction pointer to the value of its literal operand; if this instruction jumps, the instruction pointer is not increased by 2 after this instruction.
		case 3:
			if (registers[0] !== 0) {
				return value;
			}
			break;

		// The bxc instruction (opcode 4) calculates the bitwise XOR of register B and register C, then stores the result in register B. (For legacy reasons, this instruction reads an operand but ignores it.)
		case 4:
			registers[1] = xor(registers[1], registers[2]);
			break;

		// The out instruction (opcode 5) calculates the value of its combo operand modulo 8, then outputs that value. (If a program outputs multiple values, they are separated by commas.)
		case 5:
			// Handle >32 bit numbers
			output.push(value & 7);
			break;

		// The bdv instruction (opcode 6) works exactly like the adv instruction except that the result is stored in the B register. (The numerator is still read from the A register.)
		case 6:
			registers[1] = Math.floor(registers[0] / Math.pow(2, value));
			break;

		// The cdv instruction (opcode 7) works exactly like the adv instruction except that the result is stored in the C register. (The numerator is still read from the A register.)
		case 7:
			registers[2] = Math.floor(registers[0] / Math.pow(2, value));
			break;
	}

	return index + 2;
}

export function execute(data: Data, expectedOutputLength?: number) {
	const { output, program } = data;

	let index = 0;

	while (index < program.length) {
		const opcode = program[index];
		const operand = program[index + 1];

		index = executeOperation(data, opcode, operand, index);

		if (expectedOutputLength && output.length > expectedOutputLength) {
			break;
		}
	}

	if (output.some((value) => value < 0)) {
		console.log('invalid output', output);
	}
}

export function part1(input: string[]): string {
	const data = parse(input);

	execute(data);

	return data.output.join(',');
}

function isValid(data: Pick<Data, 'program' | 'registers'>, expectedOutput: number[]): boolean {
	const testData: Data = {
		...data,
		output: [],
	};

	execute(testData, expectedOutput.length);

	return testData.output.join(',') === expectedOutput.join(',');
}

function testWith(data: Data, digitIndex: number, value: number): number {
	const { program } = data;
	const expectedOutput = program.slice(digitIndex);

	let min = Number.MAX_SAFE_INTEGER;

	for (let i = 0; i < 8; i++) {
		const nextValue = value * 8 + i;
		const registers: Registers = [nextValue, 0, 0];

		if (isValid({ ...data, registers }, expectedOutput)) {
			if (digitIndex === 0) {
				return nextValue;
			} else {
				const testValue = testWith(data, digitIndex - 1, nextValue);
				if (testValue < min) {
					min = testValue;
				}
			}
		}
	}

	return min;
}

export function part2(input: string[]): number {
	const data = parse(input);

	const { program } = data;

	let min = testWith(data, program.length - 1, 0);

	return min;
}

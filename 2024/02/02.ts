type Report = number[];

function parse(input: string[]): Report[] {
	const data: Report[] = [];

	for (const line of input) {
		const report = line.split(' ').map(Number);
		data.push(report);
	}

	return data;
}

export function isReportSafe(report: Report): boolean {
	const difference = report.slice(1).map((value, index) => report[index] - value);

	const sign = Math.sign(Math.sign(difference[0]) + Math.sign(difference[difference.length - 1]));

	return difference.every(
		(value) => Math.abs(value) >= 1 && Math.abs(value) <= 3 && Math.sign(value) === sign,
	);
}

export function isReportSafeable(report: Report): boolean {
	if (isReportSafe(report)) {
		return true;
	}

	for (let index = 0; index < report.length; index++) {
		const newReport = [...report];

		newReport.splice(index, 1);

		if (isReportSafe(newReport)) {
			return true;
		}
	}

	return false;
}

export function part1(input: string[]): number {
	const data = parse(input);

	return data.map(isReportSafe).filter(Boolean).length;
}

export function part2(input: string[]): number {
	const data = parse(input);

	return data.map(isReportSafeable).filter(Boolean).length;
}

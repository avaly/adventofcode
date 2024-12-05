type Rule = number[];
type Page = number[];

function parse(input: string[]): [Rule[], Page[]] {
	const rules: Rule[] = [];
	const pages: Page[] = [];

	for (let i = 0; i < 100; i++) {
		rules.push([]);
	}

	const index = input.findIndex((value) => !value.length);

	for (const line of input.slice(0, index)) {
		const [x, y] = line.split('|').map(Number);
		rules[y].push(x);
	}
	for (const line of input.slice(index + 1)) {
		pages.push(line.split(',').map(Number));
	}

	return [rules, pages];
}

function isPageCorrect(page: Page, rules: Rule[]): boolean {
	for (let i = 1; i < page.length; i++) {
		const current = page[i];
		const rule = rules[current];

		for (let j = i - 1; j >= 0; j--) {
			if (!rule.includes(page[j])) {
				return false;
			}
		}
	}
	return true;
}

function sortPage(page: Page, rules: Rule[]): Page {
	const sorted = [...page];

	sorted.sort((a, b) => {
		return rules[a].includes(b) ? 1 : -1;
	});

	return sorted;
}

function calculate(pages: Page[]): number {
	return pages
		.map((page) => page[Math.floor(page.length / 2)])
		.reduce((acc, value) => acc + value, 0);
}

export function part1(input: string[]): number {
	const [rules, pages] = parse(input);

	return calculate(pages.filter((page) => isPageCorrect(page, rules)));
}

export function part2(input: string[]): number {
	const [rules, pages] = parse(input);

	return calculate(
		pages.filter((page) => !isPageCorrect(page, rules)).map((page) => sortPage(page, rules)),
	);
}

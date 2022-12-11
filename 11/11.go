package day09

import (
	"adventofcode/aoc2022/utils"
	"fmt"
	"math"
	"sort"
	"strings"
)

type Monkey struct {
	inspected int
	items []int
	monkeyFalse int
	monkeyTrue int
	operator string
	operandSelf bool
	operandValue int
	test int
}

func Run(input string) {
	lines := utils.ReadFile(input)

	fmt.Printf("Part 1: %v\n\n", Solve(lines, 20, 3))
	fmt.Printf("Part 2: %v\n", Solve(lines, 10000, 1))
}

func Solve(lines []string, rounds int, worryLevelDivider int) int {
	monkeys := make([]Monkey, 0)

	var index int
	var operator string
	var operandRaw string
	var test int
	var monkeyTrue int
	var monkeyFalse int

	testMultiplier := 1

	for i := 0; i < len(lines); i += 7 {
		fmt.Sscanf(lines[i], "Monkey %d", &index)
		itemsRaw := strings.Split(lines[i + 1][18:], ", ")
		items := make([]int, 0)
		for _, itemRaw := range itemsRaw {
			items = append(items, utils.ParseInt(itemRaw))
		}
		fmt.Sscanf(lines[i + 2], "  Operation: new = old %s %s", &operator, &operandRaw)
		fmt.Sscanf(lines[i + 3], "  Test: divisible by %d", &test)
		fmt.Sscanf(lines[i + 4], "    If true: throw to monkey %d", &monkeyTrue)
		fmt.Sscanf(lines[i + 5], "    If false: throw to monkey %d", &monkeyFalse)

		testMultiplier *= test
		operandValue := 0
		if operandRaw != "old" {
			operandValue = utils.ParseInt(operandRaw)
		}

		monkey := Monkey{
			inspected: 0,
			items: items,
			monkeyFalse: monkeyFalse,
			monkeyTrue: monkeyTrue,
			operator: operator,
			operandSelf: operandRaw == "old",
			operandValue: operandValue,
			test: test,
		}
		monkeys = append(monkeys, monkey)
	}

	fmt.Println("Before")
	PrintMonkeys(monkeys)

	for round := 1; round <= rounds; round++ {
		for i := 0; i < len(monkeys); i++ {
			monkey := &monkeys[i]
			for len(monkey.items) > 0 {
				worryLevel := int(math.Round(float64(Operation(monkey.items[0], monkey) / worryLevelDivider))) % testMultiplier

				monkey.inspected++;
				monkey.items = utils.RemoveOneByIndex(monkey.items, 0)

				if worryLevel % monkey.test == 0 {
					monkeys[monkey.monkeyTrue].items = append(monkeys[monkey.monkeyTrue].items, worryLevel)
				} else {
					monkeys[monkey.monkeyFalse].items = append(monkeys[monkey.monkeyFalse].items, worryLevel)
				}
			}
		}

		// if (round == 1 || round % 1000 == 0) {
		// 	fmt.Println("Round", round)
		// 	PrintMonkeys(monkeys)
		// }
	}

	fmt.Println("After round", rounds)
	PrintMonkeys(monkeys)

	monkeyBusiness := make([]int, len(monkeys))
	for i, monkey := range monkeys {
		monkeyBusiness[i] = monkey.inspected
	}

	sort.Slice(monkeyBusiness, func(a, b int) bool {
		return monkeyBusiness[a] > monkeyBusiness[b]
  })

	return monkeyBusiness[0] * monkeyBusiness[1]
}

func Operation(old int, monkey *Monkey) int {
	operand := monkey.operandValue
	if (monkey.operandSelf) {
		operand = old
	}
	switch monkey.operator {
	case "+":
		return old + operand
	case "-":
		return old - operand
	case "*":
		return old * operand
	case "/":
		return old / operand
	default:
		return old
	}
}

func PrintMonkeys(monkeys []Monkey) {
	for i := 0; i < len(monkeys); i++ {
		fmt.Printf("Monkey %d (%d): %s\n", i, monkeys[i].inspected, strings.Join(utils.ConvertToString(monkeys[i].items), ", "))
	}
	fmt.Println("")
}
package day15

import (
	"adventofcode/aoc2022/utils"
	"fmt"
	"sort"
	"strings"
)

const ROOT = "root"
const HUMAN = "humn"
const PLUS = "+"
const MINUS = "-"
const MULTIPLY = "*"
const DIVIDE = "/"

var NEGATION = map[string]string{
	"+": "-",
	"-": "+",
	"*": "/",
	"/": "*",
}

type Monkey struct {
	name     string
	value    int64
	operator string
	operands [2]string
}

func Run(input string) {
	lines := utils.ReadFile(input)

	monkeys := map[string]*Monkey{}

	for _, line := range lines {
		parts := strings.Split(line, ": ")
		operands := [2]string{}
		var operator string
		var value int64

		_, err := fmt.Sscanf(parts[1], "%s %s %s", &operands[0], &operator, &operands[1])
		if err != nil {
			value = int64(utils.ParseInt(parts[1]))
		}

		monkeys[parts[0]] = &Monkey{
			name:     parts[0],
			value:    value,
			operator: operator,
			operands: operands,
		}
	}

	fmt.Printf("Part 1: %v\n", SolvePart1(monkeys))

	// PrintState(monkeys)

	fmt.Printf("Part 2: %v\n", SolvePart2(monkeys))
}

func SolvePart1(monkeys map[string]*Monkey) int64 {
	return CalculateMonkey(monkeys, "root")
}

func SolvePart2(monkeys map[string]*Monkey) int64 {
	root := monkeys[ROOT]
	result := int64(0)

	if FindInTree(monkeys, root.operands[0], HUMAN) {
		result = CalculateHuman(monkeys, root.operands[0], monkeys[root.operands[1]].value)
	}

	if FindInTree(monkeys, root.operands[1], HUMAN) {
		result = CalculateHuman(monkeys, root.operands[1], monkeys[root.operands[0]].value)
	}

	return result
}

func CalculateHuman(monkeys map[string]*Monkey, name string, value int64) int64 {
	if name == HUMAN {
		return value
	}

	monkey := monkeys[name]
	result := int64(0)

	if FindInTree(monkeys, monkey.operands[0], HUMAN) {
		otherValue := monkeys[monkey.operands[1]].value
		nextValue := Calculate(NEGATION[monkey.operator], value, otherValue)
		result = CalculateHuman(monkeys, monkey.operands[0], nextValue)
	}

	if FindInTree(monkeys, monkey.operands[1], HUMAN) {
		otherValue := monkeys[monkey.operands[0]].value
		nextValue := int64(0)
		switch monkey.operator {
		case PLUS:
			nextValue = Calculate(NEGATION[monkey.operator], value, otherValue)
		case MINUS:
			nextValue = Calculate(monkey.operator, otherValue, value)
		case MULTIPLY:
			nextValue = Calculate(NEGATION[monkey.operator], value, otherValue)
		case DIVIDE:
			nextValue = Calculate(monkey.operator, otherValue, value)
		}
		result = CalculateHuman(monkeys, monkey.operands[1], nextValue)
	}

	return result
}

func FindInTree(monkeys map[string]*Monkey, name string, expected string) bool {
	monkey := monkeys[name]

	if name == expected {
		return true
	}
	if len(monkey.operator) == 0 {
		return false
	}
	if monkey.operands[0] == expected || monkey.operands[1] == expected {
		return true
	}

	return FindInTree(monkeys, monkey.operands[0], expected) || FindInTree(monkeys, monkey.operands[1], expected)
}

func Calculate(operator string, operand1, operand2 int64) int64 {
	switch operator {
	case PLUS:
		return operand1 + operand2
	case MINUS:
		return operand1 - operand2
	case MULTIPLY:
		return operand1 * operand2
	case DIVIDE:
		return operand1 / operand2
	}
	return 0
}

func CalculateMonkey(monkeys map[string]*Monkey, name string) int64 {
	monkey := monkeys[name]

	if len(monkey.operator) > 0 {
		operand1 := CalculateMonkey(monkeys, monkey.operands[0])
		operand2 := CalculateMonkey(monkeys, monkey.operands[1])
		switch monkey.operator {
		case PLUS:
			monkey.value = operand1 + operand2
		case MINUS:
			monkey.value = operand1 - operand2
		case MULTIPLY:
			monkey.value = operand1 * operand2
		case DIVIDE:
			monkey.value = operand1 / operand2
		}
	}

	return monkey.value
}

func PrintState(monkeys map[string]*Monkey) {
	names := []string{}
	for _, monkey := range monkeys {
		names = append(names, monkey.name)
	}
	sort.Slice(names, func(a, b int) bool {
		return names[a] < names[b]
	})
	for _, name := range names {
		monkey := monkeys[name]
		fmt.Println(monkey.name, monkey.value, monkey.operator, monkey.operands)
	}
	fmt.Println(len(names))
}

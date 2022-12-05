package day05

import (
	"adventofcode/aoc2022/utils"
	"fmt"
	"strings"
)

func Run(input string) {
  lines := utils.ReadFile(input)

	start := 0
	for i := 0; i < len(lines); i++ {
		if lines[i] == "" {
			start = i + 1
			break
		}
	}

	Part1(lines, start)
	Part2(lines, start)
}

func ReadStacks(lines []string) [][]string {
	levels := 0
	stacksLabels := []string {}

	for i := 0; i < len(lines); i++ {
		if lines[i] == "" {
			stacksLabels = strings.Split(lines[i - 1], "   ")
			levels = i - 2
			break
		}
	}

	stacks := make([][]string, len(stacksLabels))

	for i := levels; i >= 0; i-- {
		crates := lines[i]
		for n := 0; n < len(stacks); n++ {
			index := 1 + n * 4
			if (len(crates) > index  && crates[index] != 32) {
				stacks[n] = append(stacks[n], string(crates[index]))
			}
		}
	}

	return stacks
}

func Part1(lines []string, start int) {
	stacks := ReadStacks(lines)

	part1 := ""

	for i := start; i < len(lines); i++ {
		move := strings.Split(lines[i], " ")
		amount := utils.ParseInt(move[1])
		from := utils.ParseInt(move[3]) - 1
		to := utils.ParseInt(move[5]) - 1

		for j := 0; j < amount; j++ {
			lastIndex := len(stacks[from]) - 1
			last := stacks[from][lastIndex]
			stacks[from] = utils.RemoveOneByIndex(stacks[from], lastIndex)
			stacks[to] = append(stacks[to], last)
		}
	}

	for i := 0; i < len(stacks); i++ {
		part1 += stacks[i][len(stacks[i]) - 1]
	}

	fmt.Printf("Part 1: %v\n", part1)
}

func Part2(lines []string, start int) {
	stacks := ReadStacks(lines)

	part2 := ""

	for i := start; i < len(lines); i++ {
		move := strings.Split(lines[i], " ")
		amount := utils.ParseInt(move[1])
		from := utils.ParseInt(move[3]) - 1
		to := utils.ParseInt(move[5]) - 1

		endIndex := len(stacks[from])
		fromIndex := endIndex - amount

		stacks[to] = append(stacks[to], stacks[from][fromIndex:endIndex]...)
		stacks[from] = utils.RemoveManyByIndex(stacks[from], fromIndex, endIndex - 1)
	}

	for i := 0; i < len(stacks); i++ {
		part2 += stacks[i][len(stacks[i]) - 1]
	}

	fmt.Printf("Part 2: %v\n", part2)
}
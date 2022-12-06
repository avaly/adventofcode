package day05

import (
	"adventofcode/aoc2022/utils"
	"fmt"
)

func Run(input string) {
  lines := utils.ReadFile(input)

	for i := 0; i < len(lines); i++ {
		part1 := FindMessage(lines[i], 4)
		part2 := FindMessage(lines[i], 14)

		fmt.Printf("Part 1: %v\n", part1)
		fmt.Printf("Part 2: %v\n", part2)
	}
}

func FindMessage(line string, distinct int) int {
	chars := []byte(line)

	index := 0

	for i := 0; i < len(chars) - 1; i++ {
		section := []byte{}
		for j := i; j < i + distinct; j++ {
			section = utils.AddToSet(section, chars[j])
		}
		if (len(section) == distinct) {
			index = i + distinct
			break
		}
	}

	return index
}

package day04

import (
	"adventofcode/aoc2022/utils"
	"fmt"
	"strings"
)

func Run(input string) {
  lines := utils.ReadFile(input)

	part1 := 0
	part2 := 0

	for i := 0; i < len(lines); i++ {
		sections := strings.Split(lines[i], ",")
		section1 := strings.Split(sections[0], "-")
		section2 := strings.Split(sections[1], "-")

		start1 := utils.ParseInt(section1[0])
		start2 := utils.ParseInt(section2[0])
		end1 := utils.ParseInt(section1[1])
		end2 := utils.ParseInt(section2[1])

		if (start1 >= start2 && end1 <= end2) {
			part1 += 1
		} else if (start2 >= start1 && end2 <= end1) {
			part1 += 1
		}

		if (end1 >= start2 && end2 >= start1) {
			part2 += 1
		}
	}

	fmt.Printf("Part 1: %v\n", part1)
	fmt.Printf("Part 2: %v\n", part2)
}

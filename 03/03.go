package day03

import (
	"adventofcode/aoc2022/utils"
	"fmt"

	"github.com/juliangruber/go-intersect/v2"
)

func priorityForChar(value byte) byte {
	if (value < 91) {
		return 26 + value - 64
	}
	return value - 96
}

func Run(input string) {
  lines := utils.ReadFile(input)

	prioritySum := 0
	badgesSum := 0

	commonInGroup := []byte {}

	for i := 0; i < len(lines); i++ {
		items := []byte(lines[i])

		compartment1 := []byte {}
		compartment2 := []byte {}

		for j := 0; j < len(items) / 2; j++ {
			value := priorityForChar(items[j])
			compartment1 = utils.AddToSet(compartment1, value)
		}
		for j := len(items) / 2; j < len(items); j++ {
			value := priorityForChar(items[j])
			compartment2 = utils.AddToSet(compartment2, value)
		}

		intersectionInElf := intersect.SimpleGeneric(compartment1, compartment2)
		if (len(intersectionInElf) > 0) {
			prioritySum += int(intersectionInElf[0])
		}

		if (i % 3 > 0) {
			commonInGroup = intersect.SimpleGeneric(commonInGroup, items)
			if (i % 3 == 2) {
				if (len(commonInGroup) > 0) {
					badgesSum += int(priorityForChar(commonInGroup[0]))
				}
			}
		} else {
			commonInGroup = items
		}
	}

	fmt.Printf("Part 1: %v\n", prioritySum)
	fmt.Printf("Part 2: %v\n", badgesSum)
}

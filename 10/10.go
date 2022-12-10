package day09

import (
	"adventofcode/aoc2022/utils"
	"fmt"
	"math"
)

func Run(input string) {
	lines := utils.ReadFile(input)

	var value int

	signalSum := 0
	cycle := 1
	x := 1

	for i := 0; i < len(lines); i++ {
		if (lines[i] == "noop") {
			signalSum = CheckSignal(cycle, x, signalSum)
			cycle++
			continue
		}

		fmt.Sscanf(lines[i], "addx %d", &value)

		signalSum = CheckSignal(cycle, x, signalSum)
		cycle++
		signalSum = CheckSignal(cycle, x, signalSum)
		cycle++

		x += value
	}

	fmt.Printf("\nPart 1: %v\n", signalSum)
}

func CheckSignal(cycle int, x int, sum int) int {
	if (cycle % 40 == 20) {
		sum += cycle * x
	}

	if (cycle > 1 && cycle % 40 == 1) {
		fmt.Print("\n")
	}

	if (math.Abs(float64((cycle % 40) - 1 - x)) <= 1) {
		fmt.Print("#")
	} else {
		fmt.Print(".")
	}

	return sum
}

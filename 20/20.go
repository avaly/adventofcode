package day15

import (
	"adventofcode/aoc2022/utils"
	"fmt"

	"golang.org/x/exp/slices"
)

func Run(input string) {
	lines := utils.ReadFile(input)

	count := len(lines)
	original := make([]int, count)
	position := make([]int, count)
	for i, line := range lines {
		fmt.Sscanf(line, "%d", &original[i])
		position[i] = i
	}

	PrintState(original, position)

	// fmt.Printf("Part 1: %v\n", SolvePart1(original, position))
	fmt.Printf("Part 2: %v\n", SolvePart2(original, position))
}

func SolvePart1(original []int, position []int) int {
	Mix(original, position)

	return FinalCoordinates(original, position)
}

func SolvePart2(original []int, position []int) int {
	for index, item := range original {
		original[index] = item * 811589153
		position[index] = index
	}
	PrintState(original, position)

	for i := 0; i < 1; i++ {
		Mix(original, position)
		fmt.Println("Mix", i)
		PrintState(original, position)
	}

	return FinalCoordinates(original, position)
}

func Mix(original []int, position []int) {
	count := len(original)

	// fmt.Println(original)

	for i := 0; i < count; i++ {
		move := original[i]

		from := slices.Index(position, i)
		to := NewPosition(from, move, count)

		// fmt.Println(position)
		fmt.Println(i, ":", move, "-", from, "=>", to)

		if from != to {
			positionDelta := -1
			if to < from {
				positionDelta = 1
			}

			for j := from - positionDelta; j != to-positionDelta; j -= positionDelta {
				// fmt.Println(j, "->", NewIndex(j, positionDelta, count))
				position[NewIndex(j, positionDelta, count)] = position[j]
			}

			position[to] = i
		}

		// fmt.Println(position)
		// PrintState(original, position)
		// fmt.Println("")
	}
}

func FinalCoordinates(original []int, position []int) int {
	count := len(original)

	// PrintState(original, position)

	zeroOriginalIndex := slices.Index(original, 0)
	zeroPositionIndex := slices.Index(position, zeroOriginalIndex)

	fmt.Println("zeroPositionIndex", zeroPositionIndex)
	fmt.Println("1000th", NewIndex(zeroPositionIndex, 1000, count))
	fmt.Println("2000th", NewIndex(zeroPositionIndex, 2000, count))
	fmt.Println("3000th", NewIndex(zeroPositionIndex, 3000, count))

	result := original[position[NewIndex(zeroPositionIndex, 1000, count)]]
	result += original[position[NewIndex(zeroPositionIndex, 2000, count)]]
	result += original[position[NewIndex(zeroPositionIndex, 3000, count)]]

	return result
}

func NewPosition(index, delta, count int) int {
	result := index + delta
	for result <= 0 || result >= count {
		if result <= 0 {
			result = count + result - 1
		}
		if result >= count {
			result = (result % count) + 1
		}
	}
	return result
}

func NewIndex(index, delta, count int) int {
	result := index + delta
	if result < 0 {
		result = count + result
	}
	if result >= count {
		result = result % count
	}
	return result
}

func PrintState(original []int, position []int) {
	count := len(original)
	for i := 0; i < count; i++ {
		for j := 0; j < count; j++ {
			if position[j] == i {
				fmt.Print(original[position[i]], " ")
			}
		}
	}
	fmt.Println()
}

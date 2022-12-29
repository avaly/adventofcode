package day22

import (
	"adventofcode/aoc2022/utils"
	"fmt"
	"math"
)

var SNAFU_TO_DECIMAL = map[rune]int{
	45: -1,
	48: 0,
	49: 1,
	50: 2,
	61: -2,
}
var DECIMAL_TO_SNAFU = map[int]rune{}
var SNAFU_MULTIPLIERS = []int{}

const MAX_DIGITS = 20

func Run(input string) {
	lines := utils.ReadFile(input)

	numbers := make([][]int, 0)
	for _, line := range lines {
		number := make([]int, len(line))
		for index, digit := range line {
			number[len(line)-index-1] = SNAFU_TO_DECIMAL[digit]
		}
		numbers = append(numbers, number)
	}

	for i := 0; i <= 20; i++ {
		SNAFU_MULTIPLIERS = append(SNAFU_MULTIPLIERS, int(math.Pow(5, float64(i))))
	}
	for value := range SNAFU_TO_DECIMAL {
		DECIMAL_TO_SNAFU[SNAFU_TO_DECIMAL[value]] = value
	}

	fmt.Printf("Part 1: %v\n", SolvePart1(numbers))
}

func SolvePart1(numbers [][]int) string {
	sum := 0

	for _, number := range numbers {
		value := ToDecimal(number)
		sum += value
	}

	return ToSnafu(sum)
}

func ToDecimal(snafu []int) int {
	result := 0

	for index, digit := range snafu {
		result += digit * SNAFU_MULTIPLIERS[index]
	}

	return result
}

func ToSnafu(value int) string {
	result := ""

	digits := make([]int, MAX_DIGITS)
	current := value

	for index := MAX_DIGITS; index >= 0; index-- {
		multiplier := SNAFU_MULTIPLIERS[index]

		if current/multiplier == 0 {
			continue
		} else {
			digits[index] = current / multiplier

			current = current % multiplier

			if current == 0 {
				break
			}
		}
	}

	digitsCount := 0

	for index := 0; index < MAX_DIGITS; index++ {
		if digits[index] > 2 {
			digits[index] = digits[index] - 5
			digits[index+1]++
		}
		if digits[index] != 0 {
			digitsCount = index
		}
	}

	for index := digitsCount; index >= 0; index-- {
		result += string(DECIMAL_TO_SNAFU[digits[index]])
	}

	return result
}

package day23

import (
	"adventofcode/aoc2022/utils"
	"fmt"
	"strings"

	"golang.org/x/exp/slices"
)

var MOVES = [4][3][2]int{
	{{-1, -1}, {-1, 0}, {-1, 1}},
	{{1, -1}, {1, 0}, {1, 1}},
	{{-1, -1}, {0, -1}, {1, -1}},
	{{-1, 1}, {0, 1}, {1, 1}},
}
var NEIGHBOURS = [8][2]int{
	{-1, -1}, {-1, 0}, {-1, 1},
	{0, -1}, {0, 1},
	{1, -1}, {1, 0}, {1, 1},
}

const INF = 999

func Run(input string) {
	lines := utils.ReadFile(input)

	elves := [][2]int{}

	for y, line := range lines {
		for x, spot := range []byte(line) {
			if spot == 35 {
				elves = append(elves, [2]int{y, x})
			}
		}
	}
	PrintBoard(elves)

	fmt.Printf("Part 1: %v\n", SolvePart1(elves))
	// fmt.Printf("Part 2: %v\n", SolvePart2(monkeys))
}

func SolvePart1(elves [][2]int) int {
	count := len(elves)
	move := 0
	// moves := make([]int, count)
	proposals := make([][2]int, count)

	for r := 0; r < 10; r++ {
		for i := range elves {
			if IsAlone(elves, i) {
				continue
			}

			// proposal, err := FindEmpty(elves, i, moves[i])
			proposal, err := FindEmpty(elves, i, move)
			// fmt.Println(i, elves[i], move, proposal)

			if err == nil {
				proposals[i] = proposal
			} else {
				proposals[i] = [2]int{INF, INF}
			}

			// moves[i] = (moves[i] + 1) % 4
		}
		move = (move + 1) % 4

		// fmt.Println(proposals)

		for i := range elves {
			if proposals[i][0] == INF {
				continue
			}
			if !FindOther(proposals, i) {
				elves[i] = proposals[i]
			}
		}
	}

	PrintBoard(elves)

	borders := DetectBorders(elves)

	// fmt.Println(borders)

	return (borders[1][0]-borders[0][0]+1)*(borders[1][1]-borders[0][1]+1) - count
}

func IsAlone(elves [][2]int, index int) bool {
	elf := elves[index]

	for _, neighbour := range NEIGHBOURS {
		if slices.Contains(elves, [2]int{elf[0] + neighbour[0], elf[1] + neighbour[1]}) {
			return false
		}
	}

	return true
}

func FindOther(proposals [][2]int, index int) bool {
	for i, proposal := range proposals {
		if i != index && proposals[index] == proposal {
			return true
		}
	}
	return false
}

func FindEmpty(elves [][2]int, index int, move int) ([2]int, error) {
	elf := elves[index]

	for i := 0; i < 4; i++ {
		m := (move + i) % 4
		checks := MOVES[m]
		allEmpty := true
		for _, check := range checks {
			if slices.Contains(elves, [2]int{elf[0] + check[0], elf[1] + check[1]}) {
				allEmpty = false
			}
		}
		if allEmpty {
			return [2]int{elf[0] + checks[1][0], elf[1] + checks[1][1]}, nil
		}
	}

	return [2]int{0, 0}, fmt.Errorf("Not found")
}

func DetectBorders(elves [][2]int) [2][2]int {
	borders := [2][2]int{
		{0, 0},
		{0, 0},
	}

	for _, elf := range elves {
		if borders[0][0] > elf[0] {
			borders[0][0] = elf[0]
		}
		if borders[1][0] < elf[0] {
			borders[1][0] = elf[0]
		}
		if borders[0][1] > elf[1] {
			borders[0][1] = elf[1]
		}
		if borders[1][1] < elf[1] {
			borders[1][1] = elf[1]
		}
	}

	return borders
}

func PrintBoard(elves [][2]int) {
	borders := DetectBorders(elves)

	fmt.Println(strings.Repeat("-", borders[1][1]-borders[0][1]+1))
	for y := borders[0][0]; y <= borders[1][0]; y++ {
		for x := borders[0][1]; x <= borders[1][1]; x++ {
			if slices.Contains(elves, [2]int{y, x}) {
				fmt.Print("#")
			} else if x == 0 && y == 0 {
				fmt.Print("0")
			} else {
				fmt.Print(".")
			}
		}
		fmt.Println()
	}
	fmt.Println(strings.Repeat("-", borders[1][1]-borders[0][1]+1))
}

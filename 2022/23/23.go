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

	fmt.Printf("Part 1: %v\n", SolveGeneric(lines, 10))
	fmt.Printf("Part 2: %v\n", SolveGeneric(lines, 10000))
}

func Read(lines []string) [][2]int {
	elves := [][2]int{}

	for y, line := range lines {
		for x, spot := range []byte(line) {
			if spot == 35 {
				elves = append(elves, [2]int{y, x})
			}
		}
	}

	return elves
}

func SolveGeneric(lines []string, maxRounds int) int {
	elves := Read(lines)

	PrintBoard(elves)

	count := len(elves)
	move := 0
	proposals := make([][2]int, count)
	finalRound := 0

	for r := 0; r < maxRounds; r++ {
		for i := range elves {
			if IsAlone(elves, i) {
				proposals[i] = [2]int{INF, INF}
				continue
			}

			proposal, err := FindEmpty(elves, i, move)

			if err == nil {
				proposals[i] = proposal
			} else {
				proposals[i] = [2]int{INF, INF}
			}
		}
		move = (move + 1) % 4

		moved := false

		for i := range elves {
			if proposals[i][0] != INF {
				moved = true
				break
			}
		}

		if !moved {
			finalRound = r
			break
		}

		for i := range elves {
			if proposals[i][0] == INF {
				continue
			}
			if !FindOther(proposals, i) {
				elves[i] = proposals[i]
			}
		}
		// fmt.Println("Round", r+1)
		// PrintBoard(elves)
	}

	PrintBoard(elves)

	borders := DetectBorders(elves)

	// fmt.Println(borders)

	if maxRounds == 10 {
		return (borders[1][0]-borders[0][0]+1)*(borders[1][1]-borders[0][1]+1) - count
	} else {
		return finalRound + 1
	}
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

	return [2]int{0, 0}, fmt.Errorf("not found")
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

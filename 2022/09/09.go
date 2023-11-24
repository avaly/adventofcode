package day09

import (
	"adventofcode/aoc2022/utils"
	"fmt"
	"math"

	mapset "github.com/deckarep/golang-set/v2"
)

func Run(input string) {
	lines := utils.ReadFile(input)

	fmt.Printf("Part 1: %v\n", SolveGeneric(lines, make([][2]int, 2)))
	fmt.Printf("Part 2: %v\n", SolveGeneric(lines, make([][2]int, 10)))
}

func SolveGeneric(lines []string, rope [][2]int) int {
	var direction string
	var steps int

	for i := range rope {
		rope[i] = [2]int{0, 0}
	}

	tailVisited := mapset.NewSet[[2]int]([2]int{0, 0})
	tailIndex := len(rope) - 1

	for i := 0; i < len(lines); i++ {
		fmt.Sscanf(lines[i], "%s %d", &direction, &steps)
		// fmt.Print("\033[H\033[2J")

		for step := 1; step <= steps; step++ {
			switch direction {
			case "R":
				rope[0][0]++;
			case "L":
				rope[0][0]--;
			case "U":
				rope[0][1]++;
			case "D":
				rope[0][1]--;
			}

			for item := 1; item < len(rope); item++ {
				rope = MoveRopeItem(rope, item)
			}

 			tailVisited.Add(rope[tailIndex])
		}

		// PrintMap(rope, tailVisited)
		// time.Sleep(150 * time.Millisecond)
	}

	return tailVisited.Cardinality()
}

func MoveRopeItem(rope [][2]int, index int) [][2]int {
	previous := rope[index - 1]
	current := rope[index]

	absX := int(math.Abs(float64(previous[0] - current[0])))
	absY := int(math.Abs(float64(previous[1] - current[1])))

	if (absX > 1 || absY > 1) {
		if (previous[0] == current[0]) {
			// vertical
			rope[index][1] = previous[1] + (current[1] - previous[1]) / absY
		} else if (previous[1] == current[1]) {
			// horizontal
			rope[index][0] = previous[0] + (current[0] - previous[0]) / absX
		} else {
			// diagonal
			if (absX == 1) {
				rope[index][0] = previous[0]
				rope[index][1] = previous[1] + (current[1] - previous[1]) / absY
			} else if (absY == 1) {
				rope[index][0] = previous[0] + (current[0] - previous[0]) / absX
				rope[index][1] = previous[1]
			} else {
				rope[index][0] = previous[0] + (current[0] - previous[0]) / absX
				rope[index][1] = previous[1] + (current[1] - previous[1]) / absY
			}
		}
	}
	return rope
}

func PrintMap(rope [][2]int, tailVisited mapset.Set[[2]int]) {
	for y := 20; y >= -10; y-- {
		for x := -20; x < 20; x++ {
			itemOnSpot := -1
			for item := 0; item < len(rope); item++ {
				if (rope[item][0] == x && rope[item][1] == y && itemOnSpot == -1) {
					itemOnSpot = item
				}
			}

			if (itemOnSpot == 0) {
				fmt.Print("H")
			} else if (itemOnSpot > 0) {
				fmt.Print(itemOnSpot)
			} else if (x == 0 && y == 0) {
				fmt.Print("s")
			} else if (tailVisited.Contains([2]int{x, y})) {
				fmt.Print("#")
			} else {
				fmt.Print(".")
			}
		}
		fmt.Println()
	}
}
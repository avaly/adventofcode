package day14

import (
	"adventofcode/aoc2022/utils"
	"fmt"
	"math"
	"strings"
	"time"
)

var OUTSIDE = [2]int{-1, -1}

func Run(input string) {
	lines := utils.ReadFile(input)

	min := [2]int{0,500}
	max := [2]int{0,500}

	for i := 0; i < len(lines); i++ {
		rocks := ReadLine(lines[i])
		for _, rock := range rocks {
			if (rock[1] < min[1]) {
				min[1] = rock[1]
			}
			if (rock[1] > max[1]) {
				max[1] = rock[1]
			}
			if (rock[0] > max[0]) {
				max[0] = rock[0]
			}
		}
	}

	size := [2]int{max[0] + 1, max[1] - min[1] + 1}
	start := [2]int{0, 500 - min[1]}

	fmt.Printf("Part 1: %v\n", SolveGeneric(lines, size, min, start))

	max[0] += 2
	max[1] = 500 + max[0] + 1
	min[1] = 500 - max[0] - 1
	size = [2]int{max[0] + 1, max[1] - min[1] + 1}
	start = [2]int{0, 500 - min[1]}

	lines = append(lines, fmt.Sprintf("%d,%d -> %d,%d", min[1], max[0], max[1], max[0]))

	fmt.Printf("Part 2: %v\n", SolveGeneric(lines, size, min, start))
}

func ReadLine(line string) [][2]int {
	parts := strings.Split(line, " -> ")
	return utils.MapSlice(parts, func (part string, _ int) [2]int {
		coordinates := [2]int{0, 0}
		fmt.Sscanf(part, "%d,%d", &coordinates[1], &coordinates[0])
		return coordinates
	})
}

func SolveGeneric(lines []string, size [2]int, min [2]int, start [2]int) int {
	cave := [][]int{}
	for y := 0; y < size[0]; y++ {
		line := []int{}
		for x := 0; x < size[1]; x++ {
			line = append(line, 0)
		}
		cave = append(cave, line)
	}

	for i := 0; i < len(lines); i++ {
		rocks := ReadLine(lines[i])
		for r := 0; r < len(rocks); r++ {
			rocks[r][1] -= min[1]
		}

		for r := 1; r < len(rocks); r++ {
			prev := rocks[r - 1]
			curr := rocks[r]

			if (curr[0] == prev[0]) {
				for x := int(math.Min(float64(prev[1]), float64(curr[1]))); x <= int(math.Max(float64(prev[1]), float64(curr[1]))); x++ {
					cave[curr[0]][x] = 1
				}
			}
			if (curr[1] == prev[1]) {
				for y := int(math.Min(float64(prev[0]), float64(curr[0]))); y <= int(math.Max(float64(prev[0]), float64(curr[0]))); y++ {
					cave[y][curr[1]] = 1
				}
			}
		}
	}
	// PrintCave(cave, start)

	sandUnits := 0

	for {
		sand := FindSandRest(cave, start)

		if (sand == OUTSIDE) {
			break
		}

		sandUnits++
		cave[sand[0]][sand[1]] = 2

		// if (sandUnits % 500 == 0) {
		// 	PrintCave(cave, start)
		// }

		if (sand == start) {
			break
		}
	}
	// PrintCave(cave, start)

	return sandUnits
}

func FindSandRest(cave [][]int, sand [2]int) [2]int {
	y := sand[0]
	x := sand[1]

	if (y == len(cave) - 1) {
		return OUTSIDE
	} else if (cave[y + 1][x] == 0) {
		return FindSandRest(cave, [2]int{y + 1, x})
	}

	if (x == 0) {
		return OUTSIDE
	} else if (cave[y + 1][x - 1] == 0) {
		return FindSandRest(cave, [2]int{y + 1, x - 1})
	}

	if (x == len(cave[0]) - 1) {
		return OUTSIDE
	} else if (cave[y + 1][x + 1] == 0) {
		return FindSandRest(cave, [2]int{y + 1, x + 1})
	}

	return sand
}

func PrintCave(cave [][]int, start [2]int) {
	fmt.Print("\033[H\033[2J")
	for y := 0; y < len(cave); y++ {
		for x := 0; x < len(cave[0]); x++ {
			if (start[0] == y && start[1] == x && cave[y][x] != 2) {
				fmt.Print("+")
			} else {
				switch cave[y][x] {
				case 0:
					fmt.Print(".")
				case 1:
					fmt.Print("#")
				case 2:
					fmt.Print("o")
				}
			}
		}
		fmt.Println()
	}
	time.Sleep(300 * time.Millisecond)
}

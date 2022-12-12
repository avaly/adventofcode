package day12

import (
	"adventofcode/aoc2022/utils"
	"fmt"
)

const LOW = 1
const HIGH = 26

func Run(input string) {
	lines := utils.ReadFile(input)

	heightmap := make([][]int, 0)
	start := [2]int{0, 0}
	finish := [2]int{0, 0}

	for i := 0; i < len(lines); i++ {
		values := []byte(lines[i])
		heights := utils.MapSlice(values, func (height byte, index int) int {
			if (height == 83) {
				height = 97
				start = [2]int{i, index}
			}
			if (height == 69) {
				height = 122
				finish = [2]int{i, index}
			}
			return int(height - 96)
		})
		heightmap = append(heightmap, heights)
	}

	PrintMap(heightmap)

	part1 := 0
	part2 := len(heightmap) * len(heightmap[0]) + 1

	for y := 0; y < len(heightmap); y++ {
		for x := 0; x < len(heightmap[0]); x++ {
			if (heightmap[y][x] == 1) {
				steps := ShortestPath(heightmap, [2]int{y, x}, finish)
				if (start[0] == y && start[1] == x) {
					part1 = steps
				}
				if (steps > 0 && steps < part2) {
					fmt.Println(y, x, steps)
					part2 = steps
				}
			}
		}
	}

	fmt.Printf("Part 1: %v\n\n", part1)
	fmt.Printf("Part 2: %v\n", part2)
}

func ShortestPath(heightmap [][]int, start [2]int, finish [2]int) int {
	steps := make([][]int, 0)

	for y := 0; y < len(heightmap); y++ {
		steps = append(steps, make([]int, len(heightmap[0])))
	}

	VisitUp(heightmap, steps, start[0], start[1], 1)

	// PrintMap(steps)

	return steps[finish[0]][finish[1]] - 1
}

func VisitUp(heightmap [][]int, steps [][]int, y int, x int, count int) {
	if (steps[y][x] > 0 && steps[y][x] <= count) {
		return
	}

	steps[y][x] = count

	current := heightmap[y][x]

	if (y > 0 && heightmap[y - 1][x] <= current + 1) {
		VisitUp(heightmap, steps, y - 1, x, count + 1)
	}
	if (y < len(heightmap) - 1 && heightmap[y + 1][x] <= current + 1) {
		VisitUp(heightmap, steps, y + 1, x, count + 1)
	}
	if (x > 0 && heightmap[y][x - 1] <= current + 1) {
		VisitUp(heightmap, steps, y, x - 1, count + 1)
	}
	if (x < len(heightmap[0]) - 1 && heightmap[y][x + 1] <= current + 1) {
		VisitUp(heightmap, steps, y, x + 1, count + 1)
	}
}

func PrintMap(heightmap [][]int) {
	for y := 0; y < len(heightmap); y++ {
		for x := 0; x < len(heightmap[0]); x++ {
			if (heightmap[y][x] < 10) {
				fmt.Print(" ")
			}
			fmt.Print(heightmap[y][x])
			if (x == len(heightmap[0]) - 1 || heightmap[y][x + 1] < 100) {
				fmt.Print(" ")
			}
		}
		fmt.Println()
	}
	fmt.Println("---")
}

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

	// PrintMap(heightmap)

	stepsUp := ShortestPath(heightmap, start, func (current int, next int) bool {
		return next <= current + 1;
	})
	stepsDown := ShortestPath(heightmap, finish, func (current int, next int) bool {
		return next >= current - 1;
	})

	part1 := stepsUp[finish[0]][finish[1]] - 1
	part2 := len(heightmap) * len(heightmap[0]) + 1

	for y := 0; y < len(heightmap); y++ {
		for x := 0; x < len(heightmap[0]); x++ {
			if (heightmap[y][x] == 1 && stepsDown[y][x] > 0 && stepsDown[y][x] < part2) {
				part2 = stepsDown[y][x]
			}
		}
	}
	part2--;

	fmt.Printf("Part 1: %v\n", part1)
	fmt.Printf("Part 2: %v\n", part2)
}

func ShortestPath(heightmap [][]int, start [2]int, canVisit func (int, int) bool) [][]int {
	steps := make([][]int, 0)

	for y := 0; y < len(heightmap); y++ {
		steps = append(steps, make([]int, len(heightmap[0])))
	}

	Visit(heightmap, steps, start[0], start[1], 1, canVisit)

	// PrintMap(steps)

	return steps
}

func Visit(heightmap [][]int, steps [][]int, y int, x int, count int, canVisit func (int, int) bool) {
	if (steps[y][x] > 0 && steps[y][x] <= count) {
		return
	}

	steps[y][x] = count

	current := heightmap[y][x]

	if (y > 0 && canVisit(current, heightmap[y - 1][x])) {
		Visit(heightmap, steps, y - 1, x, count + 1, canVisit)
	}
	if (y < len(heightmap) - 1 && canVisit(current, heightmap[y + 1][x])) {
		Visit(heightmap, steps, y + 1, x, count + 1, canVisit)
	}
	if (x > 0 && canVisit(current, heightmap[y][x - 1])) {
		Visit(heightmap, steps, y, x - 1, count + 1, canVisit)
	}
	if (x < len(heightmap[0]) - 1 && canVisit(current, heightmap[y][x + 1])) {
		Visit(heightmap, steps, y, x + 1, count + 1, canVisit)
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

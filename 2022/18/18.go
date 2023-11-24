package day15

import (
	"adventofcode/aoc2022/utils"
	"fmt"
	"math"
)

const EMPTY = 0
const LAVA = 1
const WATER = 9

func Run(input string) {
	lines := utils.ReadFile(input)

	lake := make([][][]int, 0)
	max := 0
	for _, line := range lines {
		cube := [3]int{0, 0, 0}
		fmt.Sscanf(line, "%d,%d,%d", &cube[0], &cube[1], &cube[2])
		max = int(math.Max(float64(max), float64(cube[0])))
		max = int(math.Max(float64(max), float64(cube[1])))
		max = int(math.Max(float64(max), float64(cube[2])))
	}
	max++

	for z := 0; z < max; z++ {
		lake = append(lake, make([][]int, 0))
		for y := 0; y < max; y++ {
			lakeY := make([]int, max)
			for x := 0; x < max; x++ {
				lakeY[x] = EMPTY
			}
			lake[z] = append(lake[z], lakeY)
		}
	}

	for _, line := range lines {
		cube := [3]int{0, 0, 0}
		fmt.Sscanf(line, "%d,%d,%d", &cube[0], &cube[1], &cube[2])
		lake[cube[2]][cube[1]][cube[0]] = 1
	}

	fmt.Printf("Part 1: %v\n", SolveGeneric(lake, EMPTY))

	FillLake(lake, [3]int{0, 0, 0}, [3]int{0, 0, 0})

	fmt.Printf("Part 2: %v\n", SolveGeneric(lake, WATER))
}

func SolveGeneric(lake [][][]int, expected int) int {
	count := len(lake)
	area := 0

	for z := 0; z < count; z++ {
		for y := 0; y < count; y++ {
			for x := 0; x < count; x++ {
				if lake[z][y][x] == 1 {
					area += IsExpectedAt(lake, [3]int{z - 1, y, x}, expected)
					area += IsExpectedAt(lake, [3]int{z + 1, y, x}, expected)
					area += IsExpectedAt(lake, [3]int{z, y - 1, x}, expected)
					area += IsExpectedAt(lake, [3]int{z, y + 1, x}, expected)
					area += IsExpectedAt(lake, [3]int{z, y, x - 1}, expected)
					area += IsExpectedAt(lake, [3]int{z, y, x + 1}, expected)
				}
			}
		}
	}

	return area
}

func IsExpectedAt(lake [][][]int, point [3]int, expected int) int {
	if point[0] < 0 || point[0] >= len(lake) {
		return 1
	}
	if point[1] < 0 || point[1] >= len(lake) {
		return 1
	}
	if point[2] < 0 || point[2] >= len(lake) {
		return 1
	}

	if lake[point[0]][point[1]][point[2]] == expected {
		return 1
	}

	return 0
}

func FillLake(lake [][][]int, point [3]int, from [3]int) {
	if point[0] < 0 || point[0] >= len(lake) {
		return
	}
	if point[1] < 0 || point[1] >= len(lake) {
		return
	}
	if point[2] < 0 || point[2] >= len(lake) {
		return
	}

	if lake[point[0]][point[1]][point[2]] == 0 {
		lake[point[0]][point[1]][point[2]] = 9
	} else {
		return
	}

	FillLake(lake, [3]int{point[0] - 1, point[1], point[2]}, point)
	FillLake(lake, [3]int{point[0] + 1, point[1], point[2]}, point)
	FillLake(lake, [3]int{point[0], point[1] - 1, point[2]}, point)
	FillLake(lake, [3]int{point[0], point[1] + 1, point[2]}, point)
	FillLake(lake, [3]int{point[0], point[1], point[2] - 1}, point)
	FillLake(lake, [3]int{point[0], point[1], point[2] + 1}, point)
}

func PrintLake(lake [][][]int) {
	// fmt.Print("\033[H\033[2J")
	for z := 0; z < len(lake); z++ {
		utils.PrintMatrix(lake[z])
	}
	// time.Sleep(50 * time.Millisecond)
}

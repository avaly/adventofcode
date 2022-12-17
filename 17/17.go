package day15

import (
	"adventofcode/aoc2022/utils"
	"fmt"
)

const GAS_LEFT = 60;
const GAS_RIGHT = 62;

var MOVE_DOWN = [2]int{-1, 0};
var MOVE_LEFT = [2]int{0, -1};
var MOVE_RIGHT = [2]int{0, 1};

var SHAPE1 = [][]int{{1, 1, 1, 1}}
var SHAPE2 = [][]int{{0, 1, 0}, {1, 1, 1}, {0, 1, 0}}
var SHAPE3 = [][]int{{0, 0, 1}, {0, 0, 1}, {1, 1, 1}}
var SHAPE4 = [][]int{{1}, {1}, {1}, {1}}
var SHAPE5 = [][]int{{1, 1}, {1, 1}}

var SHAPES = [5][][]int{SHAPE1, SHAPE2, SHAPE3, SHAPE4, SHAPE5}

type Result struct {
	height int
	heightsAtMillion []int
}

func Run(input string) {
	lines := utils.ReadFile(input)

	gases := []byte(lines[0]);

	fmt.Printf("Part 1: %v\n", SolvePart1(gases, 2022).height)
	fmt.Printf("Part 2: %v\n", SolvePart2(gases, 1000000000000))
}

func SolvePart1(gases []byte, rocks int) Result {
	cave := make([][7]int, 0)

	rock := 0
	gas := 0
	towerHeight := 0
	heightsAtMillion := make([]int, 0)

	for rock < rocks && rock < 40000000 {
		shape := SHAPES[rock % 5]
		shapeHeight := len(shape)

		ExtendCave(&cave, towerHeight + 3 + shapeHeight)

		position := [2]int{towerHeight + 2 + shapeHeight, 2}

		AddMoving(cave, shape, position)

		for {
			gasDirection := gases[gas % len(gases)]
			gas += 1

			moveFromGas := MOVE_LEFT
			if (gasDirection == GAS_RIGHT) {
				moveFromGas = MOVE_RIGHT
			}

			if (CanMove(cave, shape, position, moveFromGas)) {
				RemoveMoving(cave, shape, position)
				position[1] += moveFromGas[1]
				AddMoving(cave, shape, position)
			}

			if (CanMove(cave, shape, position, MOVE_DOWN)) {
				RemoveMoving(cave, shape, position)
				position[0] += MOVE_DOWN[0]
				AddMoving(cave, shape, position)
			} else {
				break
			}
		}

		RemoveMoving(cave, shape, position)
		AddResting(cave, shape, position)

		if (towerHeight < position[0] + 1) {
			towerHeight = position[0] + 1
		}

		if (rock > 0 && rock % 1000000 == 0) {
			heightsAtMillion = append(heightsAtMillion, towerHeight)
		}

		rock += 1
	}

	return Result{
		height: towerHeight,
		heightsAtMillion: heightsAtMillion,
	}
}

func SolvePart2(gases []byte, rocks int) int {
	result1 := SolvePart1(gases, rocks)

	diffsAtMillion := make([]int, 0)
	for h := 1; h < len(result1.heightsAtMillion); h++ {
		diffsAtMillion = append(diffsAtMillion, result1.heightsAtMillion[h] - result1.heightsAtMillion[h - 1])
	}

	repeatingDiffsLength := FindRepeating(diffsAtMillion)

	repeatingHeight := 0
	for i := 0; i < repeatingDiffsLength; i++ {
		repeatingHeight += diffsAtMillion[i]
	}

	repeatingRocks := repeatingDiffsLength * 1000000
	repeatingSegments := rocks / repeatingRocks

	result2 := repeatingHeight * repeatingSegments

	// Run part 1 for the remaining rocks
	if (rocks % repeatingRocks != 0) {
		result1Rest := SolvePart1(gases, rocks % repeatingRocks)
		result2 += result1Rest.height
	}

	return result2
}

func FindRepeating(items []int) int {
	for n := 1; n <= (len(items) - 1) / 2; n++ {
		isRepeating := true
		for i := 0; i < n; i++ {
			if (items[i] != items[n + i]) {
				isRepeating = false
			}
		}
		if (isRepeating) {
			return n
		}
	}

	return 0
}

func AddMoving(cave [][7]int, shape [][]int, position [2]int) {
	PlaceShape(cave, shape, position, 2)
}

func RemoveMoving(cave [][7]int, shape [][]int, position [2]int) {
	PlaceShape(cave, shape, position, 0)
}

func AddResting(cave [][7]int, shape [][]int, position [2]int) {
	PlaceShape(cave, shape, position, 1)
}

func PlaceShape(cave [][7]int, shape [][]int, position [2]int, value int) {
	for y := 0; y < len(shape); y++ {
		for x := 0; x < len(shape[0]); x++ {
			if (shape[y][x] == 1) {
				cave[position[0] - y][position[1] + x] = value
			}
		}
	}
	// if (value == 1) {
	// 	PrintCave(cave)
	// }
}

func CanMove(cave [][7]int, shape [][]int, position [2]int, delta [2]int) bool {
	for y := 0; y < len(shape); y++ {
		for x := 0; x < len(shape[0]); x++ {
			newY := position[0] - y + delta[0]
			newX := position[1] + x + delta[1]
			if (newX < 0 || newX > 6 || newY < 0) {
				return false
			}
			if (shape[y][x] == 1 && cave[newY][newX] == 1) {
				return false
			}
		}
	}
	return true
}

func ExtendCave(cave *[][7]int, newHeight int) {
	height := len(*cave)

	if (newHeight > height) {
		for i := 0; i < newHeight - height; i++ {
			*cave = append(*cave, [7]int{0, 0, 0, 0, 0, 0, 0})
		}
	}
}

func PrintCave(cave [][7]int) {
	// fmt.Print("\033[H\033[2J")
	fmt.Println("---------")
	for y := len(cave) - 1; y >= 0; y-- {
		fmt.Print("|")
		for x := 0; x < 7; x++ {
			switch cave[y][x] {
			case 0:
				fmt.Print(".")
			case 1:
				fmt.Print("#")
			case 2:
				fmt.Print("@")
			}
		}
		fmt.Println("|")
	}
	fmt.Println("---------")
	// time.Sleep(50 * time.Millisecond)
}

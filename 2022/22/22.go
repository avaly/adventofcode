package day22

import (
	"adventofcode/aoc2022/utils"
	"fmt"
	"strings"
)

type Path struct {
	move int
	turn string
}

const LEFT = "L"
const RIGHT = "R"

var DIRECTION_LEFT = [2]int{0, -1}
var DIRECTION_RIGHT = [2]int{0, 1}
var DIRECTION_UP = [2]int{-1, 0}
var DIRECTION_DOWN = [2]int{1, 0}

var TURNS = map[rune]string{
	82: "R",
	76: "L",
}

func Run(input string) {
	lines := utils.ReadFile(input)

	maxX := 0
	maxY := 0
	for index, line := range lines {
		if len(line) == 0 {
			maxY = index
			break
		}
		tiles := []byte(line)
		if len(tiles) > maxX {
			maxX = len(tiles)
		}
	}

	board := make([][]int, maxY)
	for y := 0; y < maxY; y++ {
		tiles := []byte(lines[y])
		board[y] = make([]int, maxX)
		for x := 0; x < len(tiles); x++ {
			if tiles[x] == 46 {
				board[y][x] = 1
			} else if tiles[x] == 35 {
				board[y][x] = 9
			}
		}
	}

	path := make([]Path, 0)
	moves := lines[maxY+1]
	for len(moves) > 0 {
		nextTurn := strings.IndexFunc(moves, func(char rune) bool {
			return char == 82 || char == 76
		})
		if nextTurn > -1 {
			item := Path{
				move: utils.ParseInt(moves[0:nextTurn]),
				turn: moves[nextTurn : nextTurn+1],
			}
			path = append(path, item)
			moves = moves[nextTurn+1:]
		} else {
			item := Path{
				move: utils.ParseInt(moves),
				turn: "",
			}
			path = append(path, item)
			moves = ""
		}
	}

	fmt.Printf("Part 1: %v\n", SolvePart1(board, path))
	// fmt.Printf("Part 2: %v\n", SolvePart2(monkeys))
}

func SolvePart1(board [][]int, path []Path) int {
	maxX := len(board[0])
	maxY := len(board)

	position := [2]int{0, 0}
	direction := [2]int{0, 1}

out:
	for y := 0; y < maxY; y++ {
		for x := 0; x < maxX; x++ {
			if board[y][x] == 1 {
				position[0] = y
				position[1] = x
				break out
			}
		}
	}

	// PrintBoard(board, position, direction)

	for _, pathItem := range path {
		position = Walk(board, position, direction, pathItem.move)

		if pathItem.turn != "" {
			direction = Turn(direction, pathItem.turn)
		}
	}

	PrintBoard(board, position, direction)

	facingScore := 0
	if direction == DIRECTION_RIGHT {
		facingScore = 0
	}
	if direction == DIRECTION_DOWN {
		facingScore = 1
	}
	if direction == DIRECTION_LEFT {
		facingScore = 2
	}
	if direction == DIRECTION_UP {
		facingScore = 3
	}

	return 1000*(position[0]+1) + 4*(position[1]+1) + facingScore
}

func Walk(board [][]int, position [2]int, direction [2]int, move int) [2]int {
	result := position

	if direction[0] == 0 {
		for m := 0; m < move; m++ {
			nextIndex := NextIndex(board, result, direction)
			if board[result[0]][nextIndex] == 9 {
				break
			}
			result[1] = nextIndex
		}
	}

	if direction[1] == 0 {
		for m := 0; m < move; m++ {
			nextIndex := NextIndex(board, result, direction)
			if board[nextIndex][result[1]] == 9 {
				break
			}
			result[0] = nextIndex
		}
	}

	return result
}

func NextIndex(board [][]int, position [2]int, direction [2]int) int {
	maxY := len(board)
	maxX := len(board[0])
	result := 0

	if direction[0] == 0 {
		result = position[1] + direction[1]

		if result < 0 || result >= maxX || board[position[0]][result] == 0 {
			next := position[1] - direction[1]

			for next > 0 && next < maxX-1 && board[position[0]][next] != 0 {
				next -= direction[1]
			}
			if board[position[0]][next] == 0 {
				next += direction[1]
			}

			if board[position[0]][next] == 9 {
				result = position[1]
			} else {
				result = next
			}
		}
	}

	if direction[1] == 0 {
		result = position[0] + direction[0]

		if result < 0 || result >= maxY || board[result][position[1]] == 0 {
			next := position[0] - direction[0]

			for next > 0 && next < maxY-1 && board[next][position[1]] != 0 {
				next -= direction[0]
			}
			if board[next][position[1]] == 0 {
				next += direction[0]
			}

			if board[next][position[1]] == 9 {
				result = position[0]
			} else {
				result = next
			}
		}
	}

	return result
}

func Turn(direction [2]int, turn string) [2]int {
	result := direction

	if turn == LEFT {
		if direction == DIRECTION_RIGHT {
			result = DIRECTION_UP
		}
		if direction == DIRECTION_UP {
			result = DIRECTION_LEFT
		}
		if direction == DIRECTION_LEFT {
			result = DIRECTION_DOWN
		}
		if direction == DIRECTION_DOWN {
			result = DIRECTION_RIGHT
		}
	}

	if turn == RIGHT {
		if direction == DIRECTION_RIGHT {
			result = DIRECTION_DOWN
		}
		if direction == DIRECTION_DOWN {
			result = DIRECTION_LEFT
		}
		if direction == DIRECTION_LEFT {
			result = DIRECTION_UP
		}
		if direction == DIRECTION_UP {
			result = DIRECTION_RIGHT
		}
	}

	return result
}

func PrintBoard(board [][]int, position [2]int, direction [2]int) {
	fmt.Println(strings.Repeat("-", len(board[0])))
	for y := 0; y < len(board); y++ {
		for x := 0; x < len(board[0]); x++ {
			if board[y][x] == 0 {
				fmt.Print(" ")
			}
			if board[y][x] == 1 {
				if position[0] == y && position[1] == x {
					if direction[0] == 0 && direction[1] == 1 {
						fmt.Print(">")
					}
					if direction[0] == 0 && direction[1] == -1 {
						fmt.Print("<")
					}
					if direction[0] == 1 && direction[1] == 0 {
						fmt.Print("v")
					}
					if direction[0] == -1 && direction[1] == 0 {
						fmt.Print("^")
					}
				} else {
					fmt.Print(".")
				}
			}
			if board[y][x] == 9 {
				fmt.Print("#")
			}
		}
		fmt.Println()
	}
	fmt.Println(strings.Repeat("-", len(board[0])))
}

package day01

import (
	"adventofcode/aoc2022/utils"
	"fmt"
	"math"
	"strings"
)

var opponentShapes = [3]string{"A", "B", "C"}
var myShapes = [3]string{"X", "Y", "Z"}
var shapeScore = map[string]int {
	"A": 1,
	"B": 2,
	"C": 3,
	"X": 1,
	"Y": 2,
	"Z": 3,
}
var part1Scores = map[string]map[string]int {
	"X": {
		"A": 3,
		"B": 0,
		"C": 6,
	},
	"Y": {
		"A": 6,
		"B": 3,
		"C": 0,
	},
	"Z": {
		"A": 0,
		"B": 6,
		"C": 3,
	},
}
var part2Scores = map[string]int {
	"X": 0,
	"Y": 3,
	"Z": 6,
}

func Run(input string) {
  lines := utils.ReadFile(input)

	part2Shapes := map[string]map[string]string {}
	for i := 0; i < 3; i++ {
		loopMap := map[string]string {}
		reversedScores := utils.ReverseStringIntMap(part1Scores[myShapes[i]])

		for j := 0; j < 3; j++ {
			wantedScore := math.Abs(float64(6 - part2Scores[myShapes[j]]))
			loopMap[myShapes[j]] = reversedScores[int(wantedScore)]
		}

		part2Shapes[opponentShapes[i]] = loopMap
	}

	scorePart1 := 0
	scorePart2 := 0

	for i := 0; i < len(lines); i++ {
    play := strings.Split(lines[i], " ")

		scorePart1 += shapeScore[play[1]] + part1Scores[play[1]][play[0]]

		part2Shape := part2Shapes[play[0]][play[1]]
		scorePart2 += shapeScore[part2Shape] + part2Scores[play[1]]
  }

	fmt.Printf("Score part 1: %v\n", scorePart1)
	fmt.Printf("Score part 2: %v\n", scorePart2)
}

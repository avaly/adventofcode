package day08

import (
	"adventofcode/aoc2022/utils"
	"fmt"
)

func Run(input string) {
  lines := utils.ReadFile(input)

	trees := [][]int{}

	for i := 0; i < len(lines); i++ {
		treeLine := []int{}
		for _, tree := range []byte(lines[i]) {
			treeLine = append(treeLine, utils.ParseInt(string(tree)))
		}
		trees = append(trees, treeLine)
	}

	part1 := 0
	part2 := 0

	countY := len(trees)
	countX := len(trees[0])

	for y := 0; y < countY; y++ {
		for x := 0; x < countX; x++ {
			if (y == 0 || y == countY - 1 || x == 0 || x == countX - 1) {
				part1++;
			} else {
				part1 += IsTreeVisible(trees, x, y)
				scenic := ScenicScore(trees, x, y)
				if scenic > part2 {
					part2 = scenic
				}
			}
		}
	}

	fmt.Printf("Part 1: %v\n", part1)
	fmt.Printf("Part 2: %v\n", part2)
}

func IsTreeVisible(trees [][]int, treeX int, treeY int) int {
	countY := len(trees)
	countX := len(trees[0])

	if (
		IsTreeVisibleX(trees, treeX, treeY, 0, treeX) ||
		IsTreeVisibleX(trees, treeX, treeY, treeX + 1, countX) ||
		IsTreeVisibleY(trees, treeX, treeY, 0, treeY) ||
		IsTreeVisibleY(trees, treeX, treeY, treeY + 1, countY)) {
		return 1
	}

	return 0
}

func IsTreeVisibleX(trees [][]int, treeX int, treeY int, fromX int, toX int) bool {
	isTallest := true

	for x := fromX; x < toX; x++ {
		if trees[treeY][x] >= trees[treeY][treeX] {
			isTallest = false
			break
		}
	}

	return isTallest
}

func IsTreeVisibleY(trees [][]int, treeX int, treeY int, fromY int, toY int) bool {
	isTallest := true

	for y := fromY; y < toY; y++ {
		if trees[y][treeX] >= trees[treeY][treeX] {
			isTallest = false
			break
		}
	}

	return isTallest
}

func ScenicScore(trees [][]int, treeX int, treeY int) int {
	countY := len(trees)
	countX := len(trees[0])

	return (
		VisibleTreesX(trees, treeX, treeY, treeX - 1, 0, -1) *
		VisibleTreesX(trees, treeX, treeY, treeX + 1, countX - 1, 1) *
		VisibleTreesY(trees, treeX, treeY, treeY - 1, 0, -1) *
		VisibleTreesY(trees, treeX, treeY, treeY + 1, countY - 1, 1))
}

func VisibleTreesX(trees [][]int, treeX int, treeY int, fromX int, toX int, delta int) int {
	visible := 0

	for x := fromX; x != toX + delta; x += delta {
		if trees[treeY][x] < trees[treeY][treeX] {
			visible++;
		}
		if trees[treeY][x] >= trees[treeY][treeX] {
			visible++;
			break
		}
	}

	return visible
}

func VisibleTreesY(trees [][]int, treeX int, treeY int, fromY int, toY int, delta int) int {
	visible := 0

	for y := fromY; y != toY + delta; y += delta {
		if trees[y][treeX] < trees[treeY][treeX] {
			visible++;
		}
		if trees[y][treeX] >= trees[treeY][treeX] {
			visible++;
			break
		}
	}

	return visible
}

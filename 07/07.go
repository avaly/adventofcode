package day07

import (
	"adventofcode/aoc2022/utils"
	"fmt"
	"strings"
)

type File struct {
	name string
	size int
}

type Dir struct {
	name string
	size int
	dirs []*Dir
	files []*File
}

func Run(input string) {
  lines := utils.ReadFile(input)

	var argument string
	var command string
	var itemInfo string
	var itemName string

	var root *Dir
	var current *Dir
	path := []*Dir{}

	for i := 0; i < len(lines); i++ {
		if (lines[i] == "$ ls") {
			continue
		}

		_, err := fmt.Sscanf(lines[i], "$ %s %s", &command, &argument)

		if err != nil {
			_, err2 := fmt.Sscanf(lines[i], "%s %s", &itemInfo, &itemName)
			if err2 != nil {
				panic(err2)
			}

			if (itemInfo == "dir") {
				dir := Dir{
					name: itemName,
					dirs: []*Dir{},
					files: []*File{},
				}
				current.dirs = append(current.dirs, &dir)
			} else {
				file := File{
					name: itemName,
					size: utils.ParseInt(itemInfo),
				}
				current.files = append(current.files, &file)
			}
		} else {
			if command == "cd" {
				if (argument == "..") {
					// go to parent
					path = utils.RemoveOneByIndex(path, len(path) - 1)
					current = path[len(path) - 1]
				} else if (argument == "/" && root != nil) {
					// go to root
					path = []*Dir{root}
					current = root
				} else {
					// go to child directory
					var dir *Dir

					// try to find the directory in the current node's children
					if (current != nil) {
						for _, item := range current.dirs {
							if (item.name == argument) {
								dir = item
							}
						}
					}

					// otherwise we create a new one
					if (dir == nil) {
						dir = &Dir{
							name: argument,
							dirs: []*Dir{},
							files: []*File{},
						}
					}

					path = append(path, dir)
					current = dir
					if (root == nil) {
						root = dir
					}
				}
			}
		}
	}

	TreeSize(root)

	// PrintTree(*root, 0)

	fmt.Printf("Part 1: %v\n", CalculatePart1(root))
	fmt.Printf("Part 2: %v\n", CalculatePart2(root, 30000000 - (70000000 - root.size)))
}

func TreeSize(node *Dir) int {
	sum := 0
	for _, file := range node.files {
		sum += file.size
	}
	for _, dir := range node.dirs {
		sum += TreeSize(dir)
	}
	node.size = sum
	return sum
}

func CalculatePart1(node *Dir) int {
	result := 0
	if node.size <= 100000 {
		result = node.size
	}
	for _, dir := range node.dirs {
		result += CalculatePart1(dir)
	}
	return result
}

func CalculatePart2(node *Dir, spaceRequired int) int {
	result := 0
	if node.size >= spaceRequired {
		result = node.size
	}
	for _, dir := range node.dirs {
		dirResult := CalculatePart2(dir, spaceRequired)
		if dirResult > 0 && dirResult < result {
			result = dirResult
		}
	}
	return result
}

func PrintTree(node Dir, level int) {
	fmt.Printf("%s- %s D(%d)\n", strings.Repeat("  ", level), node.name, node.size)
	for _, file := range node.files {
		fmt.Printf("%s- %s F(%d)\n", strings.Repeat("  ", level + 1), file.name, file.size)
	}
	for _, dir := range node.dirs {
		PrintTree(*dir, level + 1)
	}
}
package day15

import (
	"adventofcode/aoc2022/utils"
	"fmt"

	"container/list"

	"github.com/dpanic/convert"
)

func Run(input string) {
	lines := utils.ReadFile(input)

	state := list.New()
	original := make([]*list.Element, 0)

	for _, line := range lines {
		var value int
		fmt.Sscanf(line, "%d", &value)
		original = append(original, state.PushBack(value))
	}

	// PrintList(state)

	fmt.Printf("Part 1: %v\n", SolvePart1(lines))
	fmt.Printf("Part 2: %v\n", SolvePart2(lines))
}

func ReadInput(lines []string, multiplier int) (*list.List, []*list.Element) {
	state := list.New()
	original := make([]*list.Element, 0)

	for _, line := range lines {
		var value int
		fmt.Sscanf(line, "%d", &value)
		original = append(original, state.PushBack(value*multiplier))
	}

	return state, original
}

func SolvePart1(lines []string) int {
	state, original := ReadInput(lines, 1)

	Mix(state, original)

	return FinalCoordinates(state)
}

func SolvePart2(lines []string) int {
	state, original := ReadInput(lines, 811589153)

	// fmt.Println("Initial arrangement:")
	// PrintList(state)

	for i := 0; i < 10; i++ {
		Mix(state, original)
		// fmt.Printf("\nAfter %d round of mixing:\n", i+1)
		// PrintList(state)
	}

	return FinalCoordinates(state)
}

func Mix(state *list.List, original []*list.Element) {
	count := state.Len() - 1

	for _, element := range original {
		value := convert.ToInt(element.Value)

		if value > 0 {
			// fmt.Printf("%d moves %d spots\n", value, value%count)
			for m := 0; m < value%count; m++ {
				if element.Next() != nil {
					state.MoveAfter(element, element.Next())
					if element.Next() == nil {
						state.MoveToFront(element)
					}
				} else {
					state.MoveToFront(element)
					state.MoveAfter(element, element.Next())
				}
			}
		}

		if value < 0 {
			// fmt.Printf("%d moves %d spots\n", value, value%count)
			for m := 0; m > value%count; m-- {
				if element.Prev() != nil {
					state.MoveBefore(element, element.Prev())
					if element.Prev() == nil {
						state.MoveToBack(element)
					}
				} else {
					state.MoveToBack(element)
					state.MoveBefore(element, element.Prev())
				}
			}
		}

		// PrintList(state)
	}
}

func FinalCoordinates(state *list.List) int {
	count := state.Len()

	zeroIndex := -1
	index := 0

	for element := state.Front(); element != nil; element = element.Next() {
		if element.Value == 0 {
			zeroIndex = index
			break
		}
		index++
	}

	// fmt.Println("1000th", FindValueAtIndex(state, (zeroIndex+1000)%count))
	// fmt.Println("2000th", FindValueAtIndex(state, (zeroIndex+2000)%count))
	// fmt.Println("3000th", FindValueAtIndex(state, (zeroIndex+3000)%count))

	result := FindValueAtIndex(state, (zeroIndex+1000)%count)
	result += FindValueAtIndex(state, (zeroIndex+2000)%count)
	result += FindValueAtIndex(state, (zeroIndex+3000)%count)

	return result
}

func FindValueAtIndex(state *list.List, wantedIndex int) int {
	index := 0
	for element := state.Front(); element != nil; element = element.Next() {
		if index == wantedIndex {
			return convert.ToInt(element.Value)
		}
		index++
	}
	return 0
}

func PrintList(state *list.List) {
	for item := state.Front(); item != nil; item = item.Next() {
		fmt.Print(item.Value, " ")
	}
	fmt.Println()
	fmt.Println()
}

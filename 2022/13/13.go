package day13

import (
	"adventofcode/aoc2022/utils"
	"fmt"
	"math"
	"sort"
)

type Item struct {
	isList bool
	list []*Item
	value int
}

func Run(input string) {
	lines := utils.ReadFile(input)

	packets := make([]*Item, 0)
	pairs := make([][2]*Item, 0)

	divider1 := &Item{
		isList: true,
		list: []*Item{{
			isList: true,
			list: []*Item{{
				isList: false,
				list: []*Item{},
				value: 2,
			}},
			value: 0,
		}},
		value: 0,
	}
	divider2 := &Item{
		isList: true,
		list: []*Item{{
			isList: true,
			list: []*Item{{
				isList: false,
				list: []*Item{},
				value: 6,
			}},
			value: 0,
		}},
		value: 0,
	}

	packets = append(packets, divider1)
	packets = append(packets, divider2)

	for i := 0; i < len(lines); i += 3 {
		pair := [2]*Item{ReadPacket(lines[i]), ReadPacket(lines[i + 1])}
		pairs = append(pairs, pair)
		packets = append(packets, pair[0])
		packets = append(packets, pair[1])
	}

	part1 := 0
	for index, pair := range pairs {
		score := ItemsInRightOrder(pair[0], pair[1], 0)
		if (score == 1) {
			part1 += index + 1
		}
	}

	part2 := 1

	sort.Slice(packets, func(a, b int) bool {
		return ItemsInRightOrder(packets[a], packets[b], 1) == 1
  })

	for index, packet := range packets {
		PrintItem(packet)
		if (packet == divider1 || packet == divider2) {
			part2 *= index + 1
		}
	}

	fmt.Printf("Part 1: %v\n", part1)
	fmt.Printf("Part 2: %v\n", part2)
}

func ReadPacket(line string) *Item {
	var current *Item
	var packet *Item
	var value string

	stack := make([]*Item, 0)
	chars := []byte(line)

	i := 0
	for i < len(chars) {
		switch chars[i] {
		case 91: // [
			newList := &Item{
				isList: true ,
				list: []*Item{},
				value: 0,
			}

			if (packet == nil) {
				packet = newList
			}

			if (current != nil) {
				current.list = append(current.list, newList)
			}
			current = newList
			stack = append(stack, current)

		case 93: // ]
			if (len(value) > 0) {
				current.list = append(current.list, &Item{
					isList: false,
					list: []*Item{},
					value: utils.ParseInt(value),
				})
				value = ""
			}

			stack = utils.RemoveOneByIndex(stack, len(stack) - 1)
			if (len(stack) > 0) {
				current = stack[len(stack) - 1]
			}

		case 44: // ,
			if (len(value) > 0) {
				current.list = append(current.list, &Item{
					isList: false,
					list: []*Item{},
					value: utils.ParseInt(value),
				})
				value = ""
			}

		default: // digits
			value += string(chars[i])
		}
		i++
	}

	return packet
}

func SolvePart1(pairs [][2]*Item) int {
	result := 0
	for index, pair := range pairs {
		score := ItemsInRightOrder(pair[0], pair[1], 0)

		if (score == 1) {
			result += index + 1
		}
	}
	return result
}

func ItemsInRightOrder(left *Item, right *Item, level int) int {
	// prefix := strings.Repeat("  ", level) + "- "

	// fmt.Print(prefix + "Compare ")
	// PrintItemRecursive(left)
	// fmt.Print(" vs ")
	// PrintItemRecursive(right)
	// fmt.Println("")

	if (!left.isList && !right.isList) {
		if (left.value == right.value) {
			return 0
		} else if (left.value < right.value) {
			// fmt.Println("  " + prefix + "Left side is smaller, so inputs are in the right order")
			return 1
			} else {
			// fmt.Println("  " + prefix + "Right side is smaller, so inputs are not in the right order")
			return -1
		}
	}

	if (!left.isList) {
		// fmt.Println("  " + prefix + "Mixed types; convert left to [" + strconv.Itoa(left.value) + "] and retry comparison")

		newList := &Item{
			isList: true,
			list: []*Item{{
				isList: false,
				list: []*Item{},
				value: left.value,
			}},
			value: 0,
		}

		return ItemsInRightOrder(newList, right, level + 1)
	}

	if (!right.isList) {
		// fmt.Println("  " + prefix + "Mixed types; convert right to [" + strconv.Itoa(right.value) + "] and retry comparison")

		newList := &Item{
			isList: true,
			list: []*Item{{
				isList: false,
				list: []*Item{},
				value: right.value,
			}},
			value: 0,
		}

		return ItemsInRightOrder(left, newList, level + 1)
	}

	max := int(math.Max(float64(len(left.list)), float64(len(right.list))))
	result := 0

	for i := 0; i < max; i++ {
		if (i >= len(left.list)) {
			// fmt.Println("  " + prefix + "Left side ran out of items, so inputs are in the right order")
			result = 1
			break
		}
		if (i >= len(right.list)) {
			// fmt.Println("  " + prefix + "Right side ran out of items, so inputs are not in the right order")
			result = -1
			break
		}
		score := ItemsInRightOrder(left.list[i], right.list[i], level + 1)
		if (score != 0) {
			result = score
			break
		}
	}

	return result
}

func PrintItem(item *Item) {
	PrintItemRecursive(item)
	fmt.Println("")
}

func PrintItemRecursive(item *Item) {
	if (item.isList) {
		fmt.Print("[")
		for index, child := range item.list {
			PrintItemRecursive(child)
			if (index < len(item.list) - 1) {
				fmt.Print(",")
			}
		}
		fmt.Print("]")
	} else {
		fmt.Print(item.value)
	}
}

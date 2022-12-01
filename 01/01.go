package day01

import (
	"adventofcode/aoc2022/utils"
	"fmt"
	"sort"
	"strconv"
)

func Run(input string) {
  lines := utils.ReadFile(input)

  elfs := make([]int, 250)
  elf := 0
  calories := 0
  max := 0

  for i := 0; i < len(lines); i++ {
    line := lines[i]
    if (line == "") {
      if (calories > max) {
        max = calories
      }
      elfs[elf] = calories
      elf += 1
      calories = 0
    } else {
      value, _ := strconv.Atoi(line)
      calories += value
    }
  }

  fmt.Println(max)

  sort.Slice(elfs, func(a, b int) bool {
    return elfs[a] > elfs[b]
  })

  fmt.Println(elfs[0] + elfs[1] + elfs[2])
}
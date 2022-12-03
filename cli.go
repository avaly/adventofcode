package main

import (
	day01 "adventofcode/aoc2022/01"
	day02 "adventofcode/aoc2022/02"
	day03 "adventofcode/aoc2022/03"
	"os"
)

func main() {
    day := os.Args[1]
    input := os.Args[2]

    days := map[string]func (string) {
        "01": day01.Run,
        "02": day02.Run,
        "03": day03.Run,
    }

    runner, ok := days[day]
    if (ok) {
        runner(input)
    }
}

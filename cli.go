package main

import (
	day01 "adventofcode/aoc2022/01"
	day02 "adventofcode/aoc2022/02"
	day03 "adventofcode/aoc2022/03"
	day04 "adventofcode/aoc2022/04"
	day05 "adventofcode/aoc2022/05"
	day06 "adventofcode/aoc2022/06"
	day07 "adventofcode/aoc2022/07"
	day08 "adventofcode/aoc2022/08"
	"os"
)

func main() {
    day := os.Args[1]
    input := os.Args[2]

    days := map[string]func (string) {
        "01": day01.Run,
        "02": day02.Run,
        "03": day03.Run,
        "04": day04.Run,
        "05": day05.Run,
        "06": day06.Run,
        "07": day07.Run,
        "08": day08.Run,
    }

    runner, ok := days[day]
    if (ok) {
        runner(input)
    }
}

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
	day09 "adventofcode/aoc2022/09"
	day10 "adventofcode/aoc2022/10"
	day11 "adventofcode/aoc2022/11"
	day12 "adventofcode/aoc2022/12"
	day13 "adventofcode/aoc2022/13"
	day14 "adventofcode/aoc2022/14"
	day15 "adventofcode/aoc2022/15"
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
        "09": day09.Run,
        "10": day10.Run,
        "11": day11.Run,
        "12": day12.Run,
        "13": day13.Run,
        "14": day14.Run,
        "15": day15.Run,
    }

    runner, ok := days[day]
    if (ok) {
        runner(input)
    }
}

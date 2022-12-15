package day15

import (
	"adventofcode/aoc2022/utils"
	"fmt"
	"math"
	"sort"
)

var OUTSIDE = [2]int{-1, 0}

func Run(input string) {
	lines := utils.ReadFile(input)

	sensors := make([][2]int, 0)
	beacons := make([][2]int, 0)
	distances := make([]int, 0)
	maxDistance := 0

	for i := 0; i < len(lines); i++ {
		sensors = append(sensors, [2]int{0, 0})
		beacons = append(beacons, [2]int{0, 0})

		fmt.Sscanf(lines[i], "Sensor at x=%d, y=%d: closest beacon is at x=%d, y=%d", &sensors[i][1], &sensors[i][0], &beacons[i][1], &beacons[i][0])

		distances = append(distances, Distance(sensors[i], beacons[i]))
		if (distances[i] > maxDistance) {
			maxDistance = distances[i]
		}
	}

	searchRow := 10
	searchMax := 20
	if len(sensors) > 14 {
		searchRow = 2000000
		searchMax = 4000000
	}

	fmt.Printf("Part 1: %v\n", SolveRow(sensors, distances, maxDistance, searchRow)[0])

	for y := 0; y <= searchMax; y++ {
		result := SolveRow(sensors, distances, maxDistance, y)
		if (result[1] > 0) {
			fmt.Printf("Part 2: %v\n", result[1])
			break
		}
	}
}

func SolveRow(sensors [][2]int, distances []int, maxDistance int, rowIndex int) [2]int {
	sensorIntervals := make([][2]int, 0)
	exclusiveIntervals := make([][2]int, 0)

	for i, sensor := range sensors {
		distance := distances[i]

		interval := IntervalForSensor(sensor, distance, rowIndex)
		if (interval != OUTSIDE) {
			sensorIntervals = append(sensorIntervals, interval)
		}
	}

	sort.Slice(sensorIntervals, func(a, b int) bool {
		if (sensorIntervals[a][0] == sensorIntervals[b][0]) {
			return sensorIntervals[a][1] < sensorIntervals[b][1]
		}
		return sensorIntervals[a][0] < sensorIntervals[b][0]
  })

	intervalIndex := -1
	for _, interval := range sensorIntervals {
		if (intervalIndex == -1) {
			exclusiveIntervals = append(exclusiveIntervals, interval)
			intervalIndex++
		} else {
			if (exclusiveIntervals[intervalIndex][1] >= interval[0] - 1) {
				exclusiveIntervals[intervalIndex][1] = int(math.Max(float64(exclusiveIntervals[intervalIndex][1]), float64(interval[1])))
			} else {
				exclusiveIntervals = append(exclusiveIntervals, interval)
				intervalIndex++
			}
		}
	}

	result := [2]int{0, 0}

	for i := 0; i < len(exclusiveIntervals); i++ {
		result[0] += exclusiveIntervals[i][1] - exclusiveIntervals[i][0]
	}
	if (len(exclusiveIntervals) > 1) {
		result[1] = (exclusiveIntervals[0][1] + 1) * 4000000 + rowIndex
	}

	return result
}

func IntervalForSensor(sensor [2]int, distance int, row int) [2]int {
	diffY := int(math.Abs(float64(sensor[0]) - float64(row)))
	diffX := distance - diffY

	if (distance < diffY) {
		return OUTSIDE
	}

	return [2]int{sensor[1] - diffX, sensor[1] + diffX}
}

func Distance(pointA [2]int, pointB [2]int) int {
	return int(math.Abs(float64(pointA[0]) - float64(pointB[0]))) + int(math.Abs(float64(pointA[1]) - float64(pointB[1])))
}

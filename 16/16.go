package day16

import (
	"adventofcode/aoc2022/utils"
	"fmt"
	"regexp"
	"sort"
	"strconv"
	"strings"
)

type Valve struct {
	distanceTo   []int
	index        int
	name         string
	flow         int
	tunnelsNames []string
	tunnels      []int
}

const INF = 999

func Run(input string) {
	lines := utils.ReadFile(input)

	valves := ReadScan(lines)
	PrintState(valves)

	start := 0
	for i, valve := range valves {
		if valve.name == "AA" {
			start = i
		}
	}
	fmt.Println("Start", start)

	fmt.Printf("Part 1: %v\n", SolvePart1(valves, start))
}

func ReadScan(lines []string) []*Valve {
	count := len(lines)
	valves := make([]*Valve, count)

	for i := 0; i < count; i++ {
		var name string
		var flow int

		fmt.Sscanf(lines[i], "Valve %s has flow rate=%d", &name, &flow)

		tunnelsRaw := strings.Split(lines[i], "; ")[1]
		regexp, _ := regexp.Compile(`tunnels? leads? to valves? (.+)$`)
		match := regexp.FindStringSubmatch(tunnelsRaw)

		valves[i] = &Valve{
			distanceTo:   make([]int, count),
			index:        i,
			name:         name,
			flow:         flow,
			tunnelsNames: strings.Split(match[1], ", "),
			tunnels:      []int{},
		}
	}

	// Find shortest path in graph: Floyd-Warshall algorithm
	shortestPaths := make([][]int, count)

	for i, valve := range valves {
		tunnels := make([]int, 0)
		for _, tunnelName := range valve.tunnelsNames {
			for index, tunnelValve := range valves {
				if tunnelValve.name == tunnelName {
					tunnels = append(tunnels, index)
					break
				}
			}
		}
		sort.Slice(tunnels, func(a, b int) bool {
			return valves[tunnels[a]].flow > valves[tunnels[b]].flow
		})
		valve.tunnels = tunnels

		shortestPaths[i] = make([]int, count)
		for j := 0; j < count; j++ {
			shortestPaths[i][j] = INF
		}
		for _, tunnel := range valve.tunnels {
			shortestPaths[i][tunnel] = 1
		}
	}

	for k := 0; k < count; k++ {
		for i := 0; i < count; i++ {
			for j := 0; j < count; j++ {
				if i != j && shortestPaths[i][k]+shortestPaths[k][j] < shortestPaths[i][j] {
					shortestPaths[i][j] = shortestPaths[i][k] + shortestPaths[k][j]
				}
			}
		}
	}
	// utils.PrintMatrix(shortestPaths)

	for i, valve := range valves {
		for j := 0; j < count; j++ {
			valve.distanceTo[j] = shortestPaths[i][j]
		}

		tunnels := make([]int, 0)
		for j := range valves {
			if valves[j].flow > 0 && valve.distanceTo[j] != INF {
				tunnels = append(tunnels, j)
			}
		}
		// Sort by maximum flow achievable
		sort.Slice(tunnels, func(a, b int) bool {
			return valves[tunnels[a]].flow*(29-valve.distanceTo[tunnels[a]]) > valves[tunnels[b]].flow*(29-valve.distanceTo[tunnels[b]])
		})
		valve.tunnels = tunnels
	}

	return valves
}

func SolvePart1(valves []*Valve, start int) int {
	count := len(valves)
	state := make([]bool, count)
	ops := [31]string{}
	pressure := [31]int{}

	return SolvePart1Backtracking(valves, ops, state, pressure, start, 1)
}

func SolvePart1Backtracking(valves []*Valve, ops [31]string, state []bool, pressure [31]int, index int, time int) int {
	if time == 30 {
		sum := 0
		for _, pressureInTime := range pressure {
			sum += pressureInTime
		}
		return sum
	}

	valve := valves[index]
	next := 0
	max := 0

	// Open valve
	if !state[index] && valve.flow > 0 {
		ops[time] = "O" + strconv.Itoa(index)
		pressure[time+1] = pressure[time] + valve.flow
		state[index] = true
		next = SolvePart1Backtracking(valves, ops, state, pressure, index, time+1)
		if next > max {
			max = next
		}
		state[index] = false
		pressure[time+1] = 0
		ops[time] = ""
	} else {
		// Travel
		for _, tunnel := range valve.tunnels {
			travelTime := valve.distanceTo[tunnel]
			if !state[tunnel] && time+travelTime < 30 {
				nextOp := "T"
				for t := 0; t < travelTime; t++ {
					ops[time+t] = nextOp
					pressure[time+t] = pressure[time]
				}
				pressure[time+travelTime] = pressure[time]
				next = SolvePart1Backtracking(valves, ops, state, pressure, tunnel, time+travelTime)
				if next > max {
					max = next
				}
				pressure[time+travelTime] = 0
				for t := 0; t < travelTime; t++ {
					if t > 1 {
						pressure[time+t] = 0
					}
					ops[time+t] = ""
				}
			}
		}
	}

	// Rest
	for t := time; t < 30; t++ {
		ops[t] = "R"
		pressure[t+1] = pressure[time]
	}
	ops[30] = "R"
	next = SolvePart1Backtracking(valves, ops, state, pressure, index, 30)
	if next > max {
		max = next
	}
	ops[30] = ""
	for t := time; t < 30; t++ {
		pressure[t+1] = 0
		ops[t] = ""
	}

	return max
}

func PrintState(valves []*Valve) {
	for index, valve := range valves {
		fmt.Printf(
			"%d: %s (%d) => %s\n",
			index,
			valve.name,
			valve.flow,
			strings.Join(utils.ConvertToString(valve.tunnels), ", "))
	}
}

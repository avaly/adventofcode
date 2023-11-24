package utils

import "strconv"

func ParseInt(value string) int {
	result, _ := strconv.Atoi(value)
	return result
}

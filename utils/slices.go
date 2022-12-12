package utils

import "strconv"

func SliceContains[T comparable](items []T, value T) bool {
	for _, item := range items {
		if item == value {
			return true
		}
	}

	return false
}

func AddToSet[T comparable](set []T, value T) []T {
	if (!SliceContains(set, value)) {
		return append(set, value)
	}

	return set
}

func RemoveManyByIndex[T any](items []T, from int, to int) []T {
	return append(items[:from], items[to+1:]...)
}

func RemoveOneByIndex[T any](items []T, index int) []T {
	return append(items[:index], items[index+1:]...)
}

func ConvertToString(items []int) []string {
	var result []string
	for _, item := range items {
		result = append(result, strconv.Itoa(item))
	}
	return result
}

func MapSlice[T, U any](input []T, f func(T, int) U) []U {
	result := make([]U, len(input))
	for i := range input {
		result[i] = f(input[i], i)
	}
	return result
}
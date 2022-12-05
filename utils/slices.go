package utils

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
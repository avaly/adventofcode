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
package utils

func ReverseStringIntMap(input map[string]int) map[int]string {
	result := make(map[int]string, len(input))

	for key, value := range input {
		result[value] = key
	}

	return result
}
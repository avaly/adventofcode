package utils

import (
	"bufio"
	"fmt"
	"os"
)

func ReadFile(input string) []string {
  file, err := os.Open(input)
  if err != nil {
    fmt.Println("Error opening file: " + input)
  }
  defer file.Close()

	result := []string {}

  scanner := bufio.NewScanner(file)
  for scanner.Scan() {
    line := scanner.Text()
		result = append(result, line)
  }

	return result
}
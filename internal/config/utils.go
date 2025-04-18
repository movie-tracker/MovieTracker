package config

import (
	"fmt"
	"os"
	"strconv"
)

func panicOnEmpty(key string) string {
	if s := os.Getenv(key); s != "" {
		return s
	} else {
		panic(fmt.Sprintf("Environment variable %s is empty", key))
	}
}

func panicOnEmptyInt(key string) int {
	s := panicOnEmpty(key)
	i, err := strconv.Atoi(s)
	if err != nil {
		panic(err)
	}
	return i
}

func envOrDefault(key string, defaultValue string) string {
	if s := os.Getenv(key); s != "" {
		return s
	} else {
		return defaultValue
	}
}

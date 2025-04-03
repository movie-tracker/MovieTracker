package config

import (
	"fmt"
	"os"
)

func panicOnEmpty(key string) string {
	if s := os.Getenv(key); s != "" {
		return s
	} else {
		panic(fmt.Sprintf("Environment variable %s is empty", key))
	}
}

func envOrDefault(key string, defaultValue string) string {
	if s := os.Getenv(key); s != "" {
		return s
	} else {
		return defaultValue
	}
}

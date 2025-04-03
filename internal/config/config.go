package config

import (
	"errors"
	"fmt"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

func envOrDefaultInt(key string, defaultValue int) int {
	if s := os.Getenv(key); s != "" {
		i, err := strconv.Atoi(s)
		if err != nil {
			panic(err)
		}
		return i
	} else {
		return defaultValue
	}
}

type ApiConfig struct {
	Host string
	Port int
}

func NewApiConfig() ApiConfig {
	err := godotenv.Load()
	if err != nil {
		panic(errors.Join(fmt.Errorf("Error loading .env file."), err))
	}

	return ApiConfig{
		Host: envOrDefault("HOST", "127.0.0.1"),
		Port: envOrDefaultInt("PORT", 8080),
	}
}

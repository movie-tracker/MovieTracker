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

type DatabaseConfig struct {
	Name     string
	Host     string
	Port     int
	User     string
	Password string
}

type TMDBConfig struct {
	ApiKey string
}

type ApiConfig struct {
	Host string
	Port int

	// Authentication
	AuthSecret   string
	AuthTokenTTL int

	// CORS
	AllowOrigin string

	Database DatabaseConfig
	TMDB     TMDBConfig
}

func NewApiConfig() ApiConfig {
	err := godotenv.Load()
	if err != nil {
		panic(errors.Join(fmt.Errorf("Error loading .env file."), err))
	}

	return ApiConfig{
		Host: envOrDefault("HOST", "127.0.0.1"),
		Port: envOrDefaultInt("PORT", 8080),
		Database: DatabaseConfig{
			Name:     panicOnEmpty("DB_NAME"),
			Host:     panicOnEmpty("DB_HOST"),
			Port:     panicOnEmptyInt("DB_PORT"),
			User:     panicOnEmpty("DB_USER"),
			Password: panicOnEmpty("DB_PASSWORD"),
		},

		AuthSecret:   panicOnEmpty("AUTH_SECRET"),
		AuthTokenTTL: envOrDefaultInt("AUTH_TOKEN_TTL", 60*24), // 24 hours

		AllowOrigin: envOrDefault("CORS_ALLOW_ORIGINS", "*"),

		TMDB: TMDBConfig{
			ApiKey: panicOnEmpty("TMDB_API_KEY"),
		},
	}
}

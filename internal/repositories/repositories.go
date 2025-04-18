package repositories

import (
	"database/sql"

	"github.com/movie-tracker/MovieTracker/internal/config"
	"github.com/movie-tracker/MovieTracker/internal/connections"
)

type RepositoryParams struct {
	DB  *sql.DB
	cfg config.ApiConfig
}

type Repositories struct {
	UserRepo IUserRepository
}

var gRepositories Repositories

func InitRepositories(cfg config.ApiConfig, conns connections.Connections) Repositories {
	gRepositories = Repositories{}

	params := RepositoryParams{
		DB:  conns.DB,
		cfg: cfg,
	}

	gRepositories.UserRepo = newUserRepository(params)

	return gRepositories
}

func GetRepositories() Repositories {
	return gRepositories
}

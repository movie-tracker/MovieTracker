package services

import (
	"github.com/movie-tracker/MovieTracker/internal/config"
	"github.com/movie-tracker/MovieTracker/internal/connections"
	"github.com/movie-tracker/MovieTracker/internal/repositories"
)

type Services struct {
	UserService IUserService
}

type ServicesParams struct {
	Cfg   config.ApiConfig
	Conns connections.Connections
	Repos repositories.Repositories
}

func NewServices(cfg config.ApiConfig, conns connections.Connections, repos repositories.Repositories) Services {
	params := ServicesParams{
		Cfg:   cfg,
		Conns: conns,
		Repos: repos,
	}

	return Services{
		UserService: newUserService(params),
	}
}

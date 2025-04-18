package services

import (
	"github.com/movie-tracker/MovieTracker/internal/config"
	"github.com/movie-tracker/MovieTracker/internal/connections"
	"github.com/movie-tracker/MovieTracker/internal/repositories"
)

type Services struct{}

type ServicesParams struct{}

func NewServices(cfg config.ApiConfig, conns connections.Connections, repos repositories.Repositories) Services {
	return Services{}
}

package services

import (
	"github.com/movie-tracker/MovieTracker/internal/config"
	"github.com/movie-tracker/MovieTracker/internal/connections"
	"github.com/movie-tracker/MovieTracker/internal/repositories"
)

type IService interface {
	ProvideServices(Services)
}

type Services struct {
	AuthService IAuthService
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

	var svcs = Services{
		AuthService: newAuthService(params),
		UserService: newUserService(params),
	}

	svcs.AuthService.ProvideServices(svcs)
	svcs.UserService.ProvideServices(svcs)

	return svcs
}

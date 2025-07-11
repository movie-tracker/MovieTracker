package controllers

import (
	"github.com/gin-gonic/gin"
	"github.com/movie-tracker/MovieTracker/internal/config"
	"github.com/movie-tracker/MovieTracker/internal/services"
)

type IController interface {
	RegisterHandlers(ControllerRegisterParams)
}

type Controllers struct {
	AuthController      IAuthController
	UserController      IUserController
	MovieController     IMovieController
	WatchlistController IWatchlistController
}

type ControllerParams struct {
	Cfg  config.ApiConfig
	Svcs services.Services
}

type ControllerRegisterParams struct {
	Public        gin.IRouter
	Authenticated gin.IRouter
}

func NewControllers(cfg config.ApiConfig, services services.Services) Controllers {
	params := ControllerParams{
		Cfg:  cfg,
		Svcs: services,
	}
	return Controllers{
		AuthController:      newAuthController(params),
		UserController:      newUserController(params),
		MovieController:     newMovieController(params),
		WatchlistController: newWatchlistController(params),
	}
}

func (c *Controllers) RegisterHandlers(params ControllerRegisterParams) {
	c.AuthController.RegisterHandlers(params)
	c.UserController.RegisterHandlers(params)
	c.MovieController.RegisterHandlers(params)
	c.WatchlistController.RegisterHandlers(params)
}

func path(prefix string, path string) string {
	return prefix + path
}

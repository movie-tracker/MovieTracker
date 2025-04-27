package controllers

import (
	"github.com/gin-gonic/gin"
	"github.com/movie-tracker/MovieTracker/internal/config"
	"github.com/movie-tracker/MovieTracker/internal/services"
)

type IController interface {
	Register(ControllerRegisterParams)
}

type Controllers struct {
	AuthController IAuthController
	UserController IUserController
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
		AuthController: newAuthController(params),
		UserController: newUserController(params),
	}
}

func (c *Controllers) Register(params ControllerRegisterParams) {
	c.AuthController.Register(params)
	c.UserController.Register(params)
}

func path(prefix string, path string) string {
	return prefix + path
}

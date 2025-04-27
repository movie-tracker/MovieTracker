package controllers

import (
	"github.com/gin-gonic/gin"
	"github.com/movie-tracker/MovieTracker/internal/config"
	"github.com/movie-tracker/MovieTracker/internal/services"
)

type IController interface {
	Register(gin.IRouter, string)
}

type Controllers struct {
	AuthController IAuthController
	UserController IUserController
}

type ControllerParams struct {
	Cfg  config.ApiConfig
	Svcs services.Services
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

func (c *Controllers) Register(router gin.IRouter, prefix string) {
	c.AuthController.Register(router, prefix)
	c.UserController.Register(router, prefix)
}

func path(prefix string, path string) string {
	return prefix + path
}

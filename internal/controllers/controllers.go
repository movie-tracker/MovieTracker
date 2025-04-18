package controllers

import (
	"log/slog"

	"github.com/gin-gonic/gin"
	"github.com/movie-tracker/MovieTracker/internal/config"
	"github.com/movie-tracker/MovieTracker/internal/services"
	"github.com/movie-tracker/MovieTracker/internal/utils"
)

type IController interface {
	Register(gin.IRouter, string)
}

type Controllers struct {
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
		UserController: newUserController(params),
	}
}

func (c *Controllers) Register(router gin.IRouter, prefix string) {
	c.UserController.Register(router, prefix)
}

func path(prefix string, path string) string {
	return prefix + path
}

func MakeHandler(f func(*gin.Context) error) gin.HandlerFunc {
	return func(c *gin.Context) {
		err := f(c)

		if err == nil {
			return
		}

		if apiErr, ok := err.(utils.IApiError); ok {
			statusCode, response := apiErr.BuildError()
			c.JSON(statusCode, response)
			return
		}

		slog.Error("error handling request", "error", err)
		c.AbortWithError(500, err)
	}
}

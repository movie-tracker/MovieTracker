package controllers

import (
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/movie-tracker/MovieTracker/internal/services"
)

type IUserController interface {
	Register(gin.IRouter, string)
}

type UserController struct {
	userService services.IUserService
}

func newUserController(params ControllerParams) IUserController {
	return &UserController{
		userService: params.Svcs.UserService,
	}
}

func (c *UserController) Register(router gin.IRouter, p string) {
	prefix := path(p, "/users")
	router.GET(prefix, MakeHandler(c.FindAll)) // GET /users
}

func (c *UserController) FindAll(ctx *gin.Context) error {
	return fmt.Errorf("NOT IMPLEMENTED")
}

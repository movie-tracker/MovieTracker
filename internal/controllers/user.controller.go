package controllers

import (
	"fmt"

	"github.com/gin-gonic/gin"
)

type IUserController interface {
	Register(gin.IRouter, string)
}

type UserController struct{}

func newUserController() IUserController {
	return &UserController{}
}

func (c *UserController) Register(router gin.IRouter, p string) {
	prefix := path(p, "/users")
	router.GET(prefix, MakeHandler(c.FindAll)) // GET /users
}

func (c *UserController) FindAll(ctx *gin.Context) error {
	return fmt.Errorf("NOT IMPLEMENTED")
}

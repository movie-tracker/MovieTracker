package controllers

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/movie-tracker/MovieTracker/internal/services"
	"github.com/movie-tracker/MovieTracker/internal/services/dto"
)

type IUserController interface {
	IController
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
	router.GET(prefix, MakeHandler(c.FindAll))                               // GET /users
	router.GET(path(prefix, "/by-email/:email"), MakeHandler(c.FindByEmail)) // GET /users/by-email/:email
	router.POST(prefix, MakeHandler(c.Create))                               // POST /users
}

func (c *UserController) FindAll(ctx *gin.Context) error {
	users, err := c.userService.FindAll()
	if err != nil {
		return err
	}

	ctx.IndentedJSON(http.StatusOK, users)
	return nil
}

func (c *UserController) FindByEmail(ctx *gin.Context) error {
	email := ctx.Param("email")

	user, err := c.userService.FindByEmail(email)
	if err != nil {
		fmt.Printf("error: %v\n", err)
		return err
	}

	ctx.IndentedJSON(http.StatusOK, user)
	return nil
}

func (c *UserController) Create(ctx *gin.Context) error {
	var userDTO dto.UserCreateDTO

	if err := ctx.BindJSON(&userDTO); err != nil {
		return err
	}

	createdUserDTO, err := c.userService.Create(userDTO)
	if err != nil {
		return err
	}

	ctx.IndentedJSON(http.StatusCreated, createdUserDTO)

	return nil
}

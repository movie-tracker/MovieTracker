package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/movie-tracker/MovieTracker/internal/services"
	"github.com/movie-tracker/MovieTracker/internal/services/dto"
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
	router.POST(prefix, MakeHandler(c.Create)) // GET /users
}

func (c *UserController) FindAll(ctx *gin.Context) error {
	users, err := c.userService.FindAll()
	if err != nil {
		return err
	}

	ctx.IndentedJSON(http.StatusOK, users)
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

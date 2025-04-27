package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/movie-tracker/MovieTracker/internal/services"
	"github.com/movie-tracker/MovieTracker/internal/services/dto"
	"github.com/movie-tracker/MovieTracker/internal/utils"
)

type IAuthController interface {
	IController
}

type AuthController struct {
	authService services.IAuthService
}

func newAuthController(params ControllerParams) IAuthController {
	return &AuthController{
		authService: params.Svcs.AuthService,
	}
}

func (c *AuthController) RegisterHandlers(params ControllerRegisterParams) {
	router := params.Public.Group("/auth")

	router.POST("/login", utils.MakeHandler(c.Login))       // POST /auth/login
	router.POST("/register", utils.MakeHandler(c.Register)) // POST /auth/register
}

func (c *AuthController) Login(ctx *gin.Context) error {
	username := ctx.PostForm("username")
	password := ctx.PostForm("password")

	if username == "" || password == "" {
		return utils.NewBadRequestError("error.login.missing_credentials")
	}

	token, err := c.authService.Login(username, password)
	if err != nil {
		return err
	}

	ctx.IndentedJSON(http.StatusOK, map[string]string{
		"authToken": token,
	})

	return nil
}

func (c *AuthController) Register(ctx *gin.Context) error {
	var err error
	var userCreateDTO dto.UserCreateDTO
	var userDTO dto.UserDTO

	if err = ctx.BindJSON(&userCreateDTO); err != nil {
		return utils.NewBadRequestError("error.auth.invalid_request")
	}

	if userDTO, err = c.authService.Register(userCreateDTO); err != nil {
		return err
	}

	ctx.IndentedJSON(http.StatusCreated, userDTO)
	return nil
}

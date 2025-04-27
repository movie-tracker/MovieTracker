package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/movie-tracker/MovieTracker/internal/services"
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

func (c *AuthController) Register(params ControllerRegisterParams) {
	router := params.Public.Group("/auth")

	router.POST("/login", utils.MakeHandler(c.Login)) // POST /auth/login
	// router.POST("/register", utils.MakeHandler(c.Register)) // POST /auth/register
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

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

// @Summary User login
// @Description Authenticate user credentials and return JWT token
// @Tags auth
// @Accept json
// @Produce json
// @Param credentials body dto.LoginRequestDTO true "Login credentials"
// @Success 200 {object} dto.AuthResponseDTO
// @Failure 400 {object} dto.ErrorResponseDTO
// @Failure 401 {object} dto.ErrorResponseDTO
// @Router /auth/login [post]
func (c *AuthController) Login(ctx *gin.Context) error {
	var loginDTO dto.LoginRequestDTO
	var err error

	if err = ctx.ShouldBindJSON(&loginDTO); err != nil {
		e := utils.NewValidationError("error.auth.invalid_request", err)
		return e
	}

	username := loginDTO.Username
	password := loginDTO.Password

	token, err := c.authService.Login(username, password)
	if err != nil {
		return err
	}

	ctx.IndentedJSON(http.StatusOK, map[string]string{
		"authToken": token,
	})

	return nil
}

// @Summary User registration
// @Description Register a new user account
// @Tags auth
// @Accept json
// @Produce json
// @Param user body dto.UserCreateDTO true "User registration data"
// @Success 201 {object} dto.UserDTO
// @Failure 400 {object} dto.ErrorResponseDTO
// @Failure 409 {object} dto.ErrorResponseDTO
// @Router /auth/register [post]
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

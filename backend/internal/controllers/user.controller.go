package controllers

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/movie-tracker/MovieTracker/internal/services"
	"github.com/movie-tracker/MovieTracker/internal/services/dto"
	"github.com/movie-tracker/MovieTracker/internal/utils"
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

func (c *UserController) RegisterHandlers(params ControllerRegisterParams) {
	router := params.Authenticated.Group("/users")

	router.GET("", utils.MakeHandler(c.FindAll))                     // GET /users
	router.GET("/profile", utils.MakeHandler(c.GetProfile))          // GET /users/profile
	router.GET("/by-email/:email", utils.MakeHandler(c.FindByEmail)) // GET /users/by-email/:email
	router.POST("", utils.MakeHandler(c.Create))                     // POST /users
}

// @Summary Get all users
// @Description Get a list of all users
// @Tags users
// @Accept json
// @Produce json
// @Security BearerAuth
// @Success 200 {array} dto.UserDTO
// @Failure 401 {object} dto.ErrorResponseDTO
// @Failure 500 {object} dto.ErrorResponseDTO
// @Router /users [get]
func (c *UserController) FindAll(ctx *gin.Context) error {
	users, err := c.userService.FindAll()
	if err != nil {
		return err
	}

	ctx.IndentedJSON(http.StatusOK, users)
	return nil
}

// @Summary Find user by email
// @Description Get user information by email address
// @Tags users
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param email path string true "User email"
// @Success 200 {object} dto.UserDTO
// @Failure 401 {object} dto.ErrorResponseDTO
// @Failure 404 {object} dto.ErrorResponseDTO
// @Router /users/by-email/{email} [get]
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

// @Summary Create new user
// @Description Create a new user account
// @Tags users
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param user body dto.UserCreateDTO true "User data"
// @Success 201 {object} dto.UserDTO
// @Failure 400 {object} dto.ErrorResponseDTO
// @Failure 401 {object} dto.ErrorResponseDTO
// @Failure 409 {object} dto.ErrorResponseDTO
// @Router /users [post]
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

// @Summary Get user profile
// @Description Get the authenticated user's profile information
// @Tags users
// @Accept json
// @Produce json
// @Security BearerAuth
// @Success 200 {object} dto.UserDTO
// @Failure 401 {object} dto.ErrorResponseDTO
// @Router /users/profile [get]
func (c UserController) GetProfile(ctx *gin.Context) error {
	requester, ok := getRequester(ctx)
	if !ok {
		return utils.NewUnauthorizedError("error.user.missing_authentication")
	}

	ctx.IndentedJSON(http.StatusOK, requester)
	return nil
}

package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/movie-tracker/MovieTracker/internal/services"
	"github.com/movie-tracker/MovieTracker/internal/utils"
)

type IMovieController interface {
	IController
}

type MovieController struct {
	movieService services.IMovieService
}

func newMovieController(params ControllerParams) IMovieController {
	return &MovieController{
		movieService: params.Svcs.MovieService,
	}
}

func (c *MovieController) RegisterHandlers(params ControllerRegisterParams) {
	router := params.Public.Group("/movies")

	router.GET("/:id", utils.MakeHandler(c.GetMovieByID)) // GET /movies/:id
}

func (c *MovieController) GetMovieByID(ctx *gin.Context) error {
	idParam := ctx.Param("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		return utils.NewValidationError("error.movie.invalid_id", err)
	}

	movie, err := c.movieService.GetByID(id)
	if err != nil {
		return err
	}

	ctx.JSON(http.StatusOK, movie)
	return nil
}

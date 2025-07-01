package controllers

import (
	"fmt"
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

	router.GET("", utils.MakeHandler(c.DiscoverMovies))      // GET /movies
	router.GET("/search", utils.MakeHandler(c.SearchMovies)) // GET /movies/search
	router.GET("/:id", utils.MakeHandler(c.GetMovieByID))    // GET /movies/:id
}

// @Summary Discover movies
// @Description Get a list of popular/recommended movies
// @Tags movies
// @Accept json
// @Produce json
// @Param page query int false "Page number (default: 1)"
// @Success 200 {object} dto.Pagination[dto.MovieDTO]
// @Failure 500 {object} dto.ErrorResponseDTO
// @Router /movies [get]
func (c *MovieController) DiscoverMovies(ctx *gin.Context) error {
	// Pegar o parâmetro page da query string
	pageStr := ctx.Query("page")
	page := 1 // valor padrão

	if pageStr != "" {
		if pageNum, err := strconv.Atoi(pageStr); err == nil && pageNum > 0 {
			page = pageNum
		}
	}

	movies, err := c.movieService.DiscoverMovies(page)
	if err != nil {
		return err
	}

	ctx.JSON(http.StatusOK, movies)
	return nil
}

// @Summary Search movies
// @Description Search for movies by title
// @Tags movies
// @Accept json
// @Produce json
// @Param query query string true "Search query"
// @Param page query int false "Page number (default: 1)"
// @Success 200 {object} dto.Pagination[dto.MovieDTO]
// @Failure 400 {object} dto.ErrorResponseDTO
// @Failure 500 {object} dto.ErrorResponseDTO
// @Router /movies/search [get]
func (c *MovieController) SearchMovies(ctx *gin.Context) error {
	query := ctx.Query("query")
	if query == "" {
		return utils.NewValidationError("error.movie.empty_query", fmt.Errorf("query parameter is required"))
	}

	pageStr := ctx.Query("page")
	page := 1

	if pageStr != "" {
		if pageNum, err := strconv.Atoi(pageStr); err == nil && pageNum > 0 {
			page = pageNum
		}
	}

	movies, err := c.movieService.SearchMovies(query, page)
	if err != nil {
		return err
	}

	ctx.JSON(http.StatusOK, movies)
	return nil
}

// @Summary Get movie by ID
// @Description Get detailed information about a specific movie
// @Tags movies
// @Accept json
// @Produce json
// @Param id path int true "Movie ID"
// @Success 200 {object} dto.MovieDTO
// @Failure 400 {object} dto.ErrorResponseDTO
// @Failure 404 {object} dto.ErrorResponseDTO
// @Router /movies/{id} [get]
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

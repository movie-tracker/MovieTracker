package controllers

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/movie-tracker/MovieTracker/internal/services"
	"github.com/movie-tracker/MovieTracker/internal/services/dto"
	"github.com/movie-tracker/MovieTracker/internal/utils"
)

type IWatchlistController interface {
	IController
}

type WatchlistController struct {
	watchlistService services.IWatchList
}

func newWatchlistController(params ControllerParams) IWatchlistController {
	return &WatchlistController{
		watchlistService: params.Svcs.WatchlistService,
	}
}

func (c *WatchlistController) RegisterHandlers(params ControllerRegisterParams) {
	router := params.Authenticated.Group("/watchlist")

	router.GET("", utils.MakeHandler(c.GetUserWatchlist))              // GET /watchlist
	router.POST("", utils.MakeHandler(c.AddToWatchlist))               // POST /watchlist
	router.PUT("/:id", utils.MakeHandler(c.UpdateWatchlistItem))       // PUT /watchlist/:id
	router.DELETE("/:id", utils.MakeHandler(c.RemoveFromWatchlist))    // DELETE /watchlist/:id
	router.PATCH("/:id/status", utils.MakeHandler(c.UpdateStatus))     // PATCH /watchlist/:id/status
	router.PATCH("/:id/favorite", utils.MakeHandler(c.ToggleFavorite)) // PATCH /watchlist/:id/favorite
	router.PATCH("/:id/rating", utils.MakeHandler(c.UpdateRating))     // PATCH /watchlist/:id/rating
}

// @Summary Get user watchlist
// @Description Get the authenticated user's watchlist
// @Tags watchlist
// @Accept json
// @Produce json
// @Security BearerAuth
// @Success 200 {array} dto.WatchListDTO
// @Failure 401 {object} dto.ErrorResponseDTO
// @Failure 500 {object} dto.ErrorResponseDTO
// @Router /watchlist [get]
func (c *WatchlistController) GetUserWatchlist(ctx *gin.Context) error {
	user, exists := getRequester(ctx)
	if !exists {
		return utils.NewUnauthorizedError("error.auth.user_not_found")
	}

	watchlist, err := c.watchlistService.GetByUser(user.ID)
	if err != nil {
		return err
	}

	ctx.JSON(http.StatusOK, watchlist)
	return nil
}

// @Summary Add movie to watchlist
// @Description Add a movie to the authenticated user's watchlist
// @Tags watchlist
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param watchlist body dto.WatchListCreateDTO true "Watchlist item data"
// @Success 201 {object} dto.WatchListDTO
// @Failure 400 {object} dto.ErrorResponseDTO
// @Failure 401 {object} dto.ErrorResponseDTO
// @Failure 409 {object} dto.ErrorResponseDTO
// @Router /watchlist [post]
func (c *WatchlistController) AddToWatchlist(ctx *gin.Context) error {
	user, exists := getRequester(ctx)
	if !exists {
		return utils.NewUnauthorizedError("error.auth.user_not_found")
	}

	var req dto.WatchListCreateDTO

	if err := ctx.ShouldBindJSON(&req); err != nil {
		return utils.NewValidationError("error.watchlist.invalid_request", err)
	}

	watchlistItem, err := c.watchlistService.AddToWatchlist(user.ID, req)
	if err != nil {
		return err
	}

	ctx.JSON(http.StatusCreated, watchlistItem)
	return nil
}

// @Summary Update watchlist item
// @Description Update multiple fields of a watchlist item
// @Tags watchlist
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path int true "Watchlist item ID"
// @Param watchlist body dto.UpdateWatchlistRequestDTO true "Updated watchlist data"
// @Success 200 {object} dto.WatchListDTO
// @Failure 400 {object} dto.ErrorResponseDTO
// @Failure 401 {object} dto.ErrorResponseDTO
// @Failure 404 {object} dto.ErrorResponseDTO
// @Router /watchlist/{id} [put]
func (c *WatchlistController) UpdateWatchlistItem(ctx *gin.Context) error {
	user, exists := getRequester(ctx)
	if !exists {
		return utils.NewUnauthorizedError("error.auth.user_not_found")
	}

	idParam := ctx.Param("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		return utils.NewValidationError("error.watchlist.invalid_id", err)
	}

	var req dto.UpdateWatchlistRequestDTO

	if err := ctx.ShouldBindJSON(&req); err != nil {
		return utils.NewValidationError("error.watchlist.invalid_request", err)
	}

	// Adicionar logs de debug
	fmt.Printf("🔍 DEBUG: Recebido request - Status: '%s', Favorite: %v, Comments: '%s', Rating: %v\n", 
		req.Status, req.Favorite, req.Comments, req.Rating)

	// CORREÇÃO: Converter tipos corretamente para o service
	var favoritePtr *bool
	if req.Favorite != nil {
		favoritePtr = req.Favorite
	}

	var ratingPtr *int
	if req.Rating != nil {
		ratingPtr = req.Rating
	}

	watchlistItem, err := c.watchlistService.UpdateWatchlistItem(user.ID, id, req.Status, favoritePtr, req.Comments, ratingPtr)
	if err != nil {
		return err
	}

	// Adicionar log da resposta
	fmt.Printf("🔍 DEBUG: Resposta do service - Status: '%s', Favorite: %v, Comments: '%s', Rating: %v\n", 
		watchlistItem.Status, watchlistItem.Favorite, watchlistItem.Comments, watchlistItem.Rating)

	ctx.JSON(http.StatusOK, watchlistItem)
	return nil
}

// @Summary Remove movie from watchlist
// @Description Remove a movie from the authenticated user's watchlist
// @Tags watchlist
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path int true "Watchlist item ID"
// @Success 204
// @Failure 400 {object} dto.ErrorResponseDTO
// @Failure 401 {object} dto.ErrorResponseDTO
// @Failure 404 {object} dto.ErrorResponseDTO
// @Router /watchlist/{id} [delete]
func (c *WatchlistController) RemoveFromWatchlist(ctx *gin.Context) error {
	user, exists := getRequester(ctx)
	if !exists {
		return utils.NewUnauthorizedError("error.auth.user_not_found")
	}

	idParam := ctx.Param("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		return utils.NewValidationError("error.watchlist.invalid_id", err)
	}

	err = c.watchlistService.RemoveFromWatchlist(user.ID, id)
	if err != nil {
		return err
	}

	ctx.JSON(http.StatusNoContent, nil)
	return nil
}

// @Summary Update watchlist status
// @Description Update the watch status of a watchlist item
// @Tags watchlist
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path int true "Watchlist item ID"
// @Param status body dto.UpdateStatusRequestDTO true "New status"
// @Success 200 {object} dto.WatchListDTO
// @Failure 400 {object} dto.ErrorResponseDTO
// @Failure 401 {object} dto.ErrorResponseDTO
// @Failure 404 {object} dto.ErrorResponseDTO
// @Router /watchlist/{id}/status [patch]
func (c *WatchlistController) UpdateStatus(ctx *gin.Context) error {
	user, exists := getRequester(ctx)
	if !exists {
		return utils.NewUnauthorizedError("error.auth.user_not_found")
	}

	idParam := ctx.Param("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		return utils.NewValidationError("error.watchlist.invalid_id", err)
	}

	var req dto.UpdateStatusRequestDTO

	if err := ctx.ShouldBindJSON(&req); err != nil {
		return utils.NewValidationError("error.watchlist.invalid_status", err)
	}

	watchlistItem, err := c.watchlistService.UpdateStatus(user.ID, id, req.Status)
	if err != nil {
		return err
	}

	ctx.JSON(http.StatusOK, watchlistItem)
	return nil
}

// @Summary Toggle favorite status
// @Description Toggle the favorite status of a watchlist item
// @Tags watchlist
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path int true "Watchlist item ID"
// @Param favorite body dto.ToggleFavoriteRequestDTO true "Favorite status"
// @Success 200 {object} dto.WatchListDTO
// @Failure 400 {object} dto.ErrorResponseDTO
// @Failure 401 {object} dto.ErrorResponseDTO
// @Failure 404 {object} dto.ErrorResponseDTO
// @Router /watchlist/{id}/favorite [patch]
func (c *WatchlistController) ToggleFavorite(ctx *gin.Context) error {
	user, exists := getRequester(ctx)
	if !exists {
		return utils.NewUnauthorizedError("error.auth.user_not_found")
	}

	idParam := ctx.Param("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		return utils.NewValidationError("error.watchlist.invalid_id", err)
	}

	var req dto.ToggleFavoriteRequestDTO

	if err := ctx.ShouldBindJSON(&req); err != nil {
		return utils.NewValidationError("error.watchlist.invalid_favorite", err)
	}

	watchlistItem, err := c.watchlistService.ToggleFavorite(user.ID, id, req.Favorite)
	if err != nil {
		return err
	}

	ctx.JSON(http.StatusOK, watchlistItem)
	return nil
}

// @Summary Update movie rating
// @Description Update the rating of a watchlist item
// @Tags watchlist
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path int true "Watchlist item ID"
// @Param rating body dto.UpdateRatingRequestDTO true "Movie rating (1-10)"
// @Success 200 {object} dto.WatchListDTO
// @Failure 400 {object} dto.ErrorResponseDTO
// @Failure 401 {object} dto.ErrorResponseDTO
// @Failure 404 {object} dto.ErrorResponseDTO
// @Router /watchlist/{id}/rating [patch]
func (c *WatchlistController) UpdateRating(ctx *gin.Context) error {
	user, exists := getRequester(ctx)
	if !exists {
		return utils.NewUnauthorizedError("error.auth.user_not_found")
	}

	idParam := ctx.Param("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		return utils.NewValidationError("error.watchlist.invalid_id", err)
	}

	var req dto.UpdateRatingRequestDTO

	if err := ctx.ShouldBindJSON(&req); err != nil {
		return utils.NewValidationError("error.watchlist.invalid_rating", err)
	}

	watchlistItem, err := c.watchlistService.UpdateRating(user.ID, id, req.Rating)
	if err != nil {
		return err
	}

	ctx.JSON(http.StatusOK, watchlistItem)
	return nil
}

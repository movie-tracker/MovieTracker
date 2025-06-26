package controllers

import (
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

func (c *WatchlistController) GetUserWatchlist(ctx *gin.Context) error {
	user, exists := getRequester(ctx)
	if !exists {
		return utils.NewUnauthorizedError("error.auth.user_not_found")
	}

	watchlist, err := c.watchlistService.GetByUser(int64(user.ID))
	if err != nil {
		return err
	}

	ctx.JSON(http.StatusOK, watchlist)
	return nil
}

func (c *WatchlistController) AddToWatchlist(ctx *gin.Context) error {
	user, exists := getRequester(ctx)
	if !exists {
		return utils.NewUnauthorizedError("error.auth.user_not_found")
	}

	var req dto.WatchListCreateDTO

	if err := ctx.ShouldBindJSON(&req); err != nil {
		return utils.NewValidationError("error.watchlist.invalid_request", err)
	}

	watchlistItem, err := c.watchlistService.AddToWatchlist(int64(user.ID), req)
	if err != nil {
		return err
	}

	ctx.JSON(http.StatusCreated, watchlistItem)
	return nil
}

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

	var req struct {
		Status   string `json:"status,omitempty"`
		Favorite *bool  `json:"favorite,omitempty"`
		Comments string `json:"comments,omitempty"`
		Rating   *int   `json:"rating,omitempty"`
	}

	if err := ctx.ShouldBindJSON(&req); err != nil {
		return utils.NewValidationError("error.watchlist.invalid_request", err)
	}

	watchlistItem, err := c.watchlistService.UpdateWatchlistItem(int64(user.ID), id, req.Status, req.Favorite, req.Comments, req.Rating)
	if err != nil {
		return err
	}

	ctx.JSON(http.StatusOK, watchlistItem)
	return nil
}

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

	err = c.watchlistService.RemoveFromWatchlist(int64(user.ID), id)
	if err != nil {
		return err
	}

	ctx.JSON(http.StatusNoContent, nil)
	return nil
}

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

	var req struct {
		Status string `json:"status" binding:"required,oneof=unwatched watching 'plan to watch' watched"`
	}

	if err := ctx.ShouldBindJSON(&req); err != nil {
		return utils.NewValidationError("error.watchlist.invalid_status", err)
	}

	watchlistItem, err := c.watchlistService.UpdateStatus(int64(user.ID), id, req.Status)
	if err != nil {
		return err
	}

	ctx.JSON(http.StatusOK, watchlistItem)
	return nil
}

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

	var req struct {
		Favorite bool `json:"favorite" binding:"required"`
	}

	if err := ctx.ShouldBindJSON(&req); err != nil {
		return utils.NewValidationError("error.watchlist.invalid_favorite", err)
	}

	watchlistItem, err := c.watchlistService.ToggleFavorite(int64(user.ID), id, req.Favorite)
	if err != nil {
		return err
	}

	ctx.JSON(http.StatusOK, watchlistItem)
	return nil
}

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

	var req struct {
		Rating *int `json:"rating" binding:"omitempty,min=1,max=10"`
	}

	if err := ctx.ShouldBindJSON(&req); err != nil {
		return utils.NewValidationError("error.watchlist.invalid_rating", err)
	}

	watchlistItem, err := c.watchlistService.UpdateRating(int64(user.ID), id, req.Rating)
	if err != nil {
		return err
	}

	ctx.JSON(http.StatusOK, watchlistItem)
	return nil
}

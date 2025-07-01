package dto

import (
	"github.com/movie-tracker/MovieTracker/internal/database/movie-tracker/public/model"
)

type WatchListDTO struct {
	ID       int32             `json:"id"`
	MovieID  int32             `json:"movie_id"`
	UserID   int32             `json:"user_id"`
	Status   model.WatchStatus `json:"status"`
	Favorite bool              `json:"favorite"`
	Comments *string           `json:"comments"`
	Rating   *int32            `json:"rating,omitempty"`
}

type WatchListCreateDTO struct {
	MovieID  int32             `json:"movie_id" binding:"required"`
	Status   model.WatchStatus `json:"status,omitempty"`
	Favorite bool              `json:"favorite,omitempty"`
	Comments *string           `json:"comments,omitempty"`
	Rating   *int32            `json:"rating,omitempty"`
}

// UpdateStatusRequestDTO represents the request body for updating watchlist status
type UpdateStatusRequestDTO struct {
	Status string `json:"status" binding:"required,oneof=unwatched watching 'plan to watch' watched" example:"watched"`
}

// ToggleFavoriteRequestDTO represents the request body for toggling favorite status
type ToggleFavoriteRequestDTO struct {
	Favorite bool `json:"favorite" binding:"required" example:"true"`
}

// UpdateRatingRequestDTO represents the request body for updating rating
type UpdateRatingRequestDTO struct {
	Rating *int `json:"rating" binding:"omitempty,min=1,max=10" example:"8"`
}

// UpdateWatchlistRequestDTO represents the request body for updating watchlist item
type UpdateWatchlistRequestDTO struct {
	Status   string `json:"status,omitempty" example:"watched"`
	Favorite *bool  `json:"favorite,omitempty" example:"true"`
	Comments string `json:"comments,omitempty" example:"Great movie!"`
	Rating   *int   `json:"rating,omitempty" example:"9"`
}

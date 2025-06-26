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
	Comments string            `json:"comments"`
	Rating   *int32            `json:"rating,omitempty"`
}

type WatchListCreateDTO struct {
	MovieID  int32             `json:"movie_id" binding:"required"`
	Status   model.WatchStatus `json:"status,omitempty"`
	Favorite bool              `json:"favorite,omitempty"`
	Comments string            `json:"comments,omitempty"`
	Rating   *int32            `json:"rating,omitempty"`
}

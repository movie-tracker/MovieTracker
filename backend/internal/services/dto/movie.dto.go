package dto

type MovieDTO struct {
	ID         int    `json:"id"`
	Title      string `json:"title"`
	PosterPath string `json:"poster_path"`
	Year       string `json:"year"`
}

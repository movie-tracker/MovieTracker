package dto

type MovieDTO struct {
	ID             int      `json:"id"`
	Title          string   `json:"title"`
	PosterPath     string   `json:"poster_path"`
	BackgroundPath string   `json:"background_path"`
	Year           string   `json:"year"`
	Description    string   `json:"description"`
	Genre          []string `json:"genre"`
	Duration       string   `json:"duration"`
}

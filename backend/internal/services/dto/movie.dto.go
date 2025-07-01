package dto

type MovieDTO struct {
	ID                  int      `json:"id"`
	Title               string   `json:"title"`
	PosterPath          string   `json:"poster_path"`
	BackgroundPath      string   `json:"background_path"`
	Year                string   `json:"year"`
	Description         string   `json:"description"`
	Genre               []string `json:"genre"`
	Duration            string   `json:"duration"`
	Tagline             string   `json:"tagline"`
	VoteAverage         float64  `json:"vote_average"`
	VoteCount           int      `json:"vote_count"`
	Popularity          float64  `json:"popularity"`
	Status              string   `json:"status"`
	ReleaseDate         string   `json:"release_date"`
	OriginalTitle       string   `json:"original_title"`
	OriginalLanguage    string   `json:"original_language"`
	Homepage            string   `json:"homepage"`
	ImdbID              *string  `json:"imdb_id"`
	Budget              int      `json:"budget"`
	Revenue             int      `json:"revenue"`
	Runtime             int      `json:"runtime"`
	ProductionCompanies []any    `json:"production_companies"`
	ProductionCountries []any    `json:"production_countries"`
	SpokenLanguages     []any    `json:"spoken_languages"`
}

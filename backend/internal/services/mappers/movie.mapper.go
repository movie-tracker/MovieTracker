package mappers

import (
	"github.com/movie-tracker/MovieTracker/internal/services/dto"
)

func MapFromTMDBToMovieDTO(tmdbMovie dto.TMDBMovieDTO) dto.MovieDTO {
	year := ""
	if len(tmdbMovie.ReleaseDate) >= 4 {
		year = tmdbMovie.ReleaseDate[:4]
	}
	return dto.MovieDTO{
		ID:         tmdbMovie.ID,
		Title:      tmdbMovie.OriginalTitle,
		PosterPath: tmdbMovie.PosterPath,
		Year:       year,
	}
}

func MapFromTMDBToMovieDTOs(tmdbMovies []dto.TMDBMovieDTO) []dto.MovieDTO {
	movies := make([]dto.MovieDTO, len(tmdbMovies))
	for i, tmdbMovie := range tmdbMovies {
		movies[i] = MapFromTMDBToMovieDTO(tmdbMovie)
	}
	return movies
}

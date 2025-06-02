package mappers

import (
	"github.com/movie-tracker/MovieTracker/internal/services/dto"
)

func MapFromTMDBToMovieDTO(tmdbMovie dto.TMDBMovieDTO) dto.MovieDTO {
	return dto.MovieDTO{
		ID:         tmdbMovie.ID,
		Title:      tmdbMovie.OriginalTitle,
		PosterPath: tmdbMovie.PosterPath,
		Year:       tmdbMovie.ReleaseDate[:4], // Extracting year from ReleaseDate
	}
}

func MapFromTMDBToMovieDTOs(tmdbMovies []dto.TMDBMovieDTO) []dto.MovieDTO {
	movies := make([]dto.MovieDTO, len(tmdbMovies))
	for i, tmdbMovie := range tmdbMovies {
		movies[i] = MapFromTMDBToMovieDTO(tmdbMovie)
	}
	return movies
}

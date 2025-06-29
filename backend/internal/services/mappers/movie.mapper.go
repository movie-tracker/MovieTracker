package mappers

import (
	"fmt"
	"github.com/movie-tracker/MovieTracker/internal/services/dto"
)

func MapFromTMDBToMovieDTO(tmdbMovie dto.TMDBMovieDTO) dto.MovieDTO {
	year := ""
	if len(tmdbMovie.ReleaseDate) >= 4 {
		year = tmdbMovie.ReleaseDate[:4]
	}
	
	// Mapear gêneros
	genres := make([]string, 0)
	for _, genre := range tmdbMovie.Genres {
		genres = append(genres, genre.Name)
	}
	
	// Mapear background path
	backgroundPath := ""
	if tmdbMovie.BackdropPath != nil {
		backgroundPath = *tmdbMovie.BackdropPath
	}
	
	// Mapear duração
	duration := ""
	if tmdbMovie.Runtime > 0 {
		duration = fmt.Sprintf("%d", tmdbMovie.Runtime)
	}
	
	return dto.MovieDTO{
		ID:             tmdbMovie.ID,
		Title:          tmdbMovie.OriginalTitle,
		PosterPath:     tmdbMovie.PosterPath,
		BackgroundPath: backgroundPath,
		Year:           year,
		Description:    tmdbMovie.Overview,
		Genre:          genres,
		Duration:       duration,
	}
}

func MapFromTMDBToMovieDTOs(tmdbMovies []dto.TMDBMovieDTO) []dto.MovieDTO {
	movies := make([]dto.MovieDTO, len(tmdbMovies))
	for i, tmdbMovie := range tmdbMovies {
		movies[i] = MapFromTMDBToMovieDTO(tmdbMovie)
	}
	return movies
}

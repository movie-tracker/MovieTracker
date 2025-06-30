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

	// Buscar tradução em português
	title := tmdbMovie.Title
	description := tmdbMovie.Overview
	tagline := tmdbMovie.Tagline

	if tmdbMovie.Translations != nil {
		for _, translation := range tmdbMovie.Translations.Translations {
			if translation.ISO6391 == "pt" || translation.ISO31661 == "BR" {
				if translation.Data.Title != "" {
					title = translation.Data.Title
				}
				if translation.Data.Overview != "" {
					description = translation.Data.Overview
				}
				if translation.Data.Tagline != "" {
					tagline = translation.Data.Tagline
				}
				break
			}
		}
	}

	// Converter slices para []any
	prodCompanies := make([]any, len(tmdbMovie.ProductionCompanies))
	for i, c := range tmdbMovie.ProductionCompanies {
		prodCompanies[i] = c
	}
	prodCountries := make([]any, len(tmdbMovie.ProductionCountries))
	for i, c := range tmdbMovie.ProductionCountries {
		prodCountries[i] = c
	}
	spokenLangs := make([]any, len(tmdbMovie.SpokenLanguages))
	for i, l := range tmdbMovie.SpokenLanguages {
		spokenLangs[i] = l
	}

	return dto.MovieDTO{
		ID:                  tmdbMovie.ID,
		Title:               title,
		PosterPath:          tmdbMovie.PosterPath,
		BackgroundPath:      backgroundPath,
		Year:                year,
		Description:         description,
		Genre:               genres,
		Duration:            duration,
		Tagline:             tagline,
		VoteAverage:         tmdbMovie.VoteAverage,
		VoteCount:           tmdbMovie.VoteCount,
		Popularity:          tmdbMovie.Popularity,
		Status:              tmdbMovie.Status,
		ReleaseDate:         tmdbMovie.ReleaseDate,
		OriginalTitle:       tmdbMovie.OriginalTitle,
		OriginalLanguage:    tmdbMovie.OriginalLanguage,
		Homepage:            tmdbMovie.Homepage,
		ImdbID:              tmdbMovie.ImdbID,
		Budget:              tmdbMovie.Budget,
		Revenue:             tmdbMovie.Revenue,
		Runtime:             tmdbMovie.Runtime,
		ProductionCompanies: prodCompanies,
		ProductionCountries: prodCountries,
		SpokenLanguages:     spokenLangs,
	}
}

func MapFromTMDBToMovieDTOs(tmdbMovies []dto.TMDBMovieDTO) []dto.MovieDTO {
	movies := make([]dto.MovieDTO, len(tmdbMovies))
	for i, tmdbMovie := range tmdbMovies {
		movies[i] = MapFromTMDBToMovieDTO(tmdbMovie)
	}
	return movies
}

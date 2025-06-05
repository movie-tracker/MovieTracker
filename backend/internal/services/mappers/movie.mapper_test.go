package mappers

import (
	"testing"

	"github.com/movie-tracker/MovieTracker/internal/services/dto"
	"github.com/stretchr/testify/assert"
)

func TestMapFromTMDBToMovieDTO(t *testing.T) {
	// Arrange
	tmdbMovie := dto.TMDBMovieDTO{
		ID:            123,
		OriginalTitle: "Test Movie",
		PosterPath:    "/test-poster.jpg",
		ReleaseDate:   "2023-05-15",
	}

	// Act
	result := MapFromTMDBToMovieDTO(tmdbMovie)

	// Assert
	assert.Equal(t, 123, result.ID)
	assert.Equal(t, "Test Movie", result.Title)
	assert.Equal(t, "/test-poster.jpg", result.PosterPath)
	assert.Equal(t, "2023", result.Year)
}

func TestMapFromTMDBToMovieDTOs(t *testing.T) {
	// Arrange
	tmdbMovies := []dto.TMDBMovieDTO{
		{
			ID:            123,
			OriginalTitle: "Test Movie 1",
			PosterPath:    "/test-poster1.jpg",
			ReleaseDate:   "2023-05-15",
		},
		{
			ID:            456,
			OriginalTitle: "Test Movie 2",
			PosterPath:    "/test-poster2.jpg",
			ReleaseDate:   "2022-10-20",
		},
	}

	// Act
	results := MapFromTMDBToMovieDTOs(tmdbMovies)

	// Assert
	assert.Len(t, results, 2)

	assert.Equal(t, 123, results[0].ID)
	assert.Equal(t, "Test Movie 1", results[0].Title)
	assert.Equal(t, "/test-poster1.jpg", results[0].PosterPath)
	assert.Equal(t, "2023", results[0].Year)

	assert.Equal(t, 456, results[1].ID)
	assert.Equal(t, "Test Movie 2", results[1].Title)
	assert.Equal(t, "/test-poster2.jpg", results[1].PosterPath)
	assert.Equal(t, "2022", results[1].Year)
}

package services

import (
	"errors"
	"testing"

	"github.com/movie-tracker/MovieTracker/internal/services/dto"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

// Mock do repositório de filmes
type MockMovieRepository struct {
	mock.Mock
}

func (m *MockMovieRepository) DiscoverMovies() (dto.Pagination[dto.TMDBMovieDTO], error) {
	args := m.Called()
	return args.Get(0).(dto.Pagination[dto.TMDBMovieDTO]), args.Error(1)
}

func (m *MockMovieRepository) GetByID(id int) (dto.TMDBMovieDTO, error) {
	args := m.Called(id)
	return args.Get(0).(dto.TMDBMovieDTO), args.Error(1)
}

func TestMovieService_DiscoverMovies_Success(t *testing.T) {
	// Arrange
	mockRepo := new(MockMovieRepository)
	service := &MovieService{
		movieRepo: mockRepo,
	}

	// Configurar o comportamento do mock
	tmdbPagination := dto.Pagination[dto.TMDBMovieDTO]{
		Page:         1,
		TotalPages:   10,
		TotalResults: 200,
		Results: []dto.TMDBMovieDTO{
			{
				ID:            123,
				OriginalTitle: "Test Movie 1",
				PosterPath:    "/poster1.jpg",
				ReleaseDate:   "2023-01-15",
			},
			{
				ID:            456,
				OriginalTitle: "Test Movie 2",
				PosterPath:    "/poster2.jpg",
				ReleaseDate:   "2022-10-20",
			},
		},
	}

	mockRepo.On("DiscoverMovies").Return(tmdbPagination, nil)

	// Act
	result, err := service.DiscoverMovies()

	// Assert
	assert.NoError(t, err)
	assert.Equal(t, 1, result.Page)
	assert.Equal(t, 10, result.TotalPages)
	assert.Equal(t, 200, result.TotalResults)
	assert.Len(t, result.Results, 2)

	// Verificar se o mapeamento foi feito corretamente
	assert.Equal(t, 123, result.Results[0].ID)
	assert.Equal(t, "Test Movie 1", result.Results[0].Title)
	assert.Equal(t, "2023", result.Results[0].Year)

	mockRepo.AssertExpectations(t)
}

func TestMovieService_DiscoverMovies_Error(t *testing.T) {
	// Arrange
	mockRepo := new(MockMovieRepository)
	service := &MovieService{
		movieRepo: mockRepo,
	}

	expectedError := errors.New("API error")
	mockRepo.On("DiscoverMovies").Return(dto.Pagination[dto.TMDBMovieDTO]{}, expectedError)

	// Act
	result, err := service.DiscoverMovies()

	// Assert
	assert.Error(t, err)
	assert.Equal(t, expectedError, err)
	assert.Empty(t, result.Results)

	mockRepo.AssertExpectations(t)
}

func TestMovieService_GetByID_Success(t *testing.T) {
	// Arrange
	mockRepo := new(MockMovieRepository)
	service := &MovieService{
		movieRepo: mockRepo,
	}

	tmdbMovie := dto.TMDBMovieDTO{
		ID:            123,
		OriginalTitle: "Test Movie",
		PosterPath:    "/poster.jpg",
		ReleaseDate:   "2023-05-15",
	}

	mockRepo.On("GetByID", 123).Return(tmdbMovie, nil)

	// Act
	movie, err := service.GetByID(123)

	// Assert
	assert.NoError(t, err)
	assert.Equal(t, 123, movie.ID)
	assert.Equal(t, "Test Movie", movie.Title)
	assert.Equal(t, "/poster.jpg", movie.PosterPath)
	assert.Equal(t, "2023", movie.Year)

	mockRepo.AssertExpectations(t)
}

func TestMovieService_GetByID_Error(t *testing.T) {
	// Arrange
	mockRepo := new(MockMovieRepository)
	service := &MovieService{
		movieRepo: mockRepo,
	}

	expectedError := errors.New("movie not found")
	mockRepo.On("GetByID", 999).Return(dto.TMDBMovieDTO{}, expectedError)

	// Act
	movie, err := service.GetByID(999)

	// Assert
	assert.Error(t, err)
	assert.Equal(t, expectedError, err)
	assert.Empty(t, movie.ID)
	assert.Empty(t, movie.Title)

	mockRepo.AssertExpectations(t)
}

package controllers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/movie-tracker/MovieTracker/internal/services"
	"github.com/movie-tracker/MovieTracker/internal/services/dto"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

// Mock do serviço de watchlist
type MockWatchlistService struct {
	mock.Mock
}

func (m *MockWatchlistService) ProvideServices(services.Services) {}

func (m *MockWatchlistService) GetByUser(userID int32) ([]dto.WatchListDTO, error) {
	args := m.Called(userID)
	return args.Get(0).([]dto.WatchListDTO), args.Error(1)
}

func (m *MockWatchlistService) AddToWatchlist(userID int32, createDTO dto.WatchListCreateDTO) (dto.WatchListDTO, error) {
	args := m.Called(userID, createDTO)
	return args.Get(0).(dto.WatchListDTO), args.Error(1)
}

func (m *MockWatchlistService) UpdateWatchlistItem(userID int32, movieID int, status string, favorite *bool, comments string, rating *int) (dto.WatchListDTO, error) {
	args := m.Called(userID, movieID, status, favorite, comments, rating)
	return args.Get(0).(dto.WatchListDTO), args.Error(1)
}

func (m *MockWatchlistService) RemoveFromWatchlist(userID int32, movieID int) error {
	args := m.Called(userID, movieID)
	return args.Error(0)
}

func (m *MockWatchlistService) UpdateStatus(userID int32, movieID int, status string) (dto.WatchListDTO, error) {
	args := m.Called(userID, movieID, status)
	return args.Get(0).(dto.WatchListDTO), args.Error(1)
}

func (m *MockWatchlistService) ToggleFavorite(userID int32, movieID int, favorite bool) (dto.WatchListDTO, error) {
	args := m.Called(userID, movieID, favorite)
	return args.Get(0).(dto.WatchListDTO), args.Error(1)
}

func (m *MockWatchlistService) UpdateRating(userID int32, movieID int, rating *int) (dto.WatchListDTO, error) {
	args := m.Called(userID, movieID, rating)
	return args.Get(0).(dto.WatchListDTO), args.Error(1)
}

func TestWatchlistController_GetUserWatchlist_Success(t *testing.T) {
	// Setup
	gin.SetMode(gin.TestMode)
	mockService := new(MockWatchlistService)

	controller := &WatchlistController{
		watchlistService: mockService,
	}

	// Mock data
	expectedWatchlist := []dto.WatchListDTO{
		{
			MovieID:  123,
			UserID:   1,
			Status:   "watched",
			Favorite: true,
			Comments: &[]string{"Great movie!"}[0],
			Rating:   &[]int32{9}[0],
		},
	}

	mockService.On("GetByUser", int32(1)).Return(expectedWatchlist, nil)

	// Create router and register handlers
	r := gin.Default()
	auth := r.Group("/api")
	auth.Use(func(c *gin.Context) {
		c.Set("requester", dto.UserDTO{ID: 1})
		c.Next()
	})

	controller.RegisterHandlers(ControllerRegisterParams{
		Authenticated: auth,
	})

	// Create request
	req, _ := http.NewRequest("GET", "/api/watchlist", nil)
	w := httptest.NewRecorder()

	// Execute
	r.ServeHTTP(w, req)

	// Assert
	assert.Equal(t, http.StatusOK, w.Code)

	var response []dto.WatchListDTO
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.Len(t, response, 1)
	assert.Equal(t, expectedWatchlist[0].MovieID, response[0].MovieID)
	assert.Equal(t, expectedWatchlist[0].UserID, response[0].UserID)

	mockService.AssertExpectations(t)
}

func TestWatchlistController_AddToWatchlist_Success(t *testing.T) {
	// Setup
	gin.SetMode(gin.TestMode)
	mockService := new(MockWatchlistService)

	controller := &WatchlistController{
		watchlistService: mockService,
	}

	// Mock data
	rating := int32(8)
	createDTO := dto.WatchListCreateDTO{
		MovieID:  123,
		Status:   "plan to watch",
		Favorite: false,
		Comments: &[]string{"Want to watch this"}[0],
		Rating:   &rating,
	}

	expectedItem := dto.WatchListDTO{
		MovieID:  123,
		UserID:   1,
		Status:   "plan to watch",
		Favorite: false,
		Comments: &[]string{"Want to watch this"}[0],
		Rating:   &rating,
	}

	mockService.On("AddToWatchlist", int32(1), createDTO).Return(expectedItem, nil)

	// Create router and register handlers
	r := gin.Default()
	auth := r.Group("/api")
	auth.Use(func(c *gin.Context) {
		c.Set("requester", dto.UserDTO{ID: 1})
		c.Next()
	})

	controller.RegisterHandlers(ControllerRegisterParams{
		Authenticated: auth,
	})

	// Create request body
	requestBody := map[string]interface{}{
		"movie_id": 123,
		"status":   "plan to watch",
		"favorite": false,
		"comments": "Want to watch this",
		"rating":   8,
	}

	jsonBody, _ := json.Marshal(requestBody)
	req, _ := http.NewRequest("POST", "/api/watchlist", bytes.NewBuffer(jsonBody))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	// Execute
	r.ServeHTTP(w, req)

	// Assert
	assert.Equal(t, http.StatusCreated, w.Code)

	var response dto.WatchListDTO
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.Equal(t, expectedItem.MovieID, response.MovieID)
	assert.Equal(t, expectedItem.UserID, response.UserID)
	assert.Equal(t, expectedItem.Status, response.Status)

	mockService.AssertExpectations(t)
}

func TestWatchlistController_GetUserWatchlist_Unauthorized(t *testing.T) {
	// Setup
	gin.SetMode(gin.TestMode)
	mockService := new(MockWatchlistService)

	controller := &WatchlistController{
		watchlistService: mockService,
	}

	// Create router and register handlers (sem middleware de auth)
	r := gin.Default()
	auth := r.Group("/api")

	controller.RegisterHandlers(ControllerRegisterParams{
		Authenticated: auth,
	})

	// Create request
	req, _ := http.NewRequest("GET", "/api/watchlist", nil)
	w := httptest.NewRecorder()

	// Execute
	r.ServeHTTP(w, req)

	// Assert - deveria retornar erro de autorização
	assert.NotEqual(t, http.StatusOK, w.Code)
}

package services

import (
	"github.com/movie-tracker/MovieTracker/internal/repositories"
	"github.com/movie-tracker/MovieTracker/internal/services/dto"
)

type IWatchList interface {
	IService
	GetByUser(userID int64) ([]dto.WatchListDTO, error)
	AddToWatchlist(userID int64, createDTO dto.WatchListCreateDTO) (dto.WatchListDTO, error)
	UpdateWatchlistItem(userID int64, id int, status string, favorite *bool, comments string, rating *int) (dto.WatchListDTO, error)
	RemoveFromWatchlist(userID int64, id int) error
	UpdateStatus(userID int64, id int, status string) (dto.WatchListDTO, error)
	ToggleFavorite(userID int64, id int, favorite bool) (dto.WatchListDTO, error)
	UpdateRating(userID int64, id int, rating *int) (dto.WatchListDTO, error)
}

type WatchListService struct {
	repo repositories.IWatchListRepository
}

func newWatchListService(params ServicesParams) IWatchList {
	return &WatchListService{
		repo: params.Repos.WatchListRepo,
	}
}

func (s *WatchListService) ProvideServices(Services) {}

func (s *WatchListService) GetByUser(userID int64) ([]dto.WatchListDTO, error) {
	watchlistItems, err := s.repo.GetByUser(userID)
	if err != nil {
		return nil, err
	}

	var watchlistDTOs = make([]dto.WatchListDTO, 0)
	for _, item := range watchlistItems {
		watchlistDTO := dto.WatchListDTO{
			ID:       item.ID,
			MovieID:  *item.MovieID,
			UserID:   item.UserID,
			Status:   item.Status,
			Favorite: item.Favorite,
			Comments: item.Comments,
			Rating:   item.Rating,
		}
		watchlistDTOs = append(watchlistDTOs, watchlistDTO)
	}

	return watchlistDTOs, nil
}

func (s *WatchListService) AddToWatchlist(userID int64, createDTO dto.WatchListCreateDTO) (dto.WatchListDTO, error) {
	watchListItem, err := s.repo.AddToWatchlist(userID, createDTO)
	if err != nil {
		return dto.WatchListDTO{}, err
	}

	watchlistDTO := dto.WatchListDTO{
		ID:       watchListItem.ID,
		MovieID:  *watchListItem.MovieID,
		UserID:   watchListItem.UserID,
		Status:   watchListItem.Status,
		Favorite: watchListItem.Favorite,
		Comments: watchListItem.Comments,
		Rating:   watchListItem.Rating,
	}

	return watchlistDTO, nil
}

func (s *WatchListService) UpdateWatchlistItem(userID int64, id int, status string, favorite *bool, comments string, rating *int) (dto.WatchListDTO, error) {
	watchlistItem, err := s.repo.UpdateWatchlistItem(userID, id, status, favorite, comments, rating)
	if err != nil {
		return dto.WatchListDTO{}, err
	}

	watchlistDTO := dto.WatchListDTO{
		ID:       watchlistItem.ID,
		MovieID:  *watchlistItem.MovieID,
		UserID:   watchlistItem.UserID,
		Status:   watchlistItem.Status,
		Favorite: watchlistItem.Favorite,
		Comments: watchlistItem.Comments,
		Rating:   watchlistItem.Rating,
	}

	return watchlistDTO, nil
}

func (s *WatchListService) RemoveFromWatchlist(userID int64, id int) error {
	return s.repo.RemoveFromWatchlist(userID, id)
}

func (s *WatchListService) UpdateStatus(userID int64, id int, status string) (dto.WatchListDTO, error) {
	watchlistItem, err := s.repo.UpdateStatus(userID, id, status)
	if err != nil {
		return dto.WatchListDTO{}, err
	}

	watchlistDTO := dto.WatchListDTO{
		ID:       watchlistItem.ID,
		MovieID:  *watchlistItem.MovieID,
		UserID:   watchlistItem.UserID,
		Status:   watchlistItem.Status,
		Favorite: watchlistItem.Favorite,
		Comments: watchlistItem.Comments,
		Rating:   watchlistItem.Rating,
	}

	return watchlistDTO, nil
}

func (s *WatchListService) ToggleFavorite(userID int64, id int, favorite bool) (dto.WatchListDTO, error) {
	watchlistItem, err := s.repo.ToggleFavorite(userID, id, favorite)
	if err != nil {
		return dto.WatchListDTO{}, err
	}

	watchlistDTO := dto.WatchListDTO{
		ID:       watchlistItem.ID,
		MovieID:  *watchlistItem.MovieID,
		UserID:   watchlistItem.UserID,
		Status:   watchlistItem.Status,
		Favorite: watchlistItem.Favorite,
		Comments: watchlistItem.Comments,
		Rating:   watchlistItem.Rating,
	}

	return watchlistDTO, nil
}

func (s *WatchListService) UpdateRating(userID int64, id int, rating *int) (dto.WatchListDTO, error) {
	watchlistItem, err := s.repo.UpdateRating(userID, id, rating)
	if err != nil {
		return dto.WatchListDTO{}, err
	}

	watchlistDTO := dto.WatchListDTO{
		ID:       watchlistItem.ID,
		MovieID:  *watchlistItem.MovieID,
		UserID:   watchlistItem.UserID,
		Status:   watchlistItem.Status,
		Favorite: watchlistItem.Favorite,
		Comments: watchlistItem.Comments,
		Rating:   watchlistItem.Rating,
	}

	return watchlistDTO, nil
}

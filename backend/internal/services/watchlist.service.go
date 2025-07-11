package services

import (
	"github.com/movie-tracker/MovieTracker/internal/repositories"
	"github.com/movie-tracker/MovieTracker/internal/services/dto"
)

type IWatchList interface {
	IService
	GetByUser(userID int32) ([]dto.WatchListDTO, error)
	AddToWatchlist(userID int32, createDTO dto.WatchListCreateDTO) (dto.WatchListDTO, error)
	UpdateWatchlistItem(userID int32, movieID int, status string, favorite *bool, comments string, rating *int) (dto.WatchListDTO, error)
	RemoveFromWatchlist(userID int32, movieID int) error
	UpdateStatus(userID int32, movieID int, status string) (dto.WatchListDTO, error)
	ToggleFavorite(userID int32, movieID int, favorite bool) (dto.WatchListDTO, error)
	UpdateRating(userID int32, movieID int, rating *int) (dto.WatchListDTO, error)
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

func (s *WatchListService) GetByUser(userID int32) ([]dto.WatchListDTO, error) {
	watchlistItems, err := s.repo.GetByUser(userID)
	if err != nil {
		return nil, err
	}

	var watchlistDTOs = make([]dto.WatchListDTO, 0)
	for _, item := range watchlistItems {
		var commentsPtr *string
		if item.Comments != nil {
			commentsPtr = item.Comments
		}

		var ratingPtr *int32
		if item.Rating != nil {
			val := int32(*item.Rating)
			ratingPtr = &val
		}

		watchlistDTO := dto.WatchListDTO{
			MovieID:  item.MovieID,
			UserID:   item.UserID,
			Status:   item.Status,
			Favorite: item.Favorite,
			Comments: commentsPtr,
			Rating:   ratingPtr,
		}
		watchlistDTOs = append(watchlistDTOs, watchlistDTO)
	}

	return watchlistDTOs, nil
}

func (s *WatchListService) AddToWatchlist(userID int32, createDTO dto.WatchListCreateDTO) (dto.WatchListDTO, error) {
	watchListItem, err := s.repo.AddToWatchlist(userID, createDTO)
	if err != nil {
		return dto.WatchListDTO{}, err
	}

	var commentsPtr *string
	if watchListItem.Comments != nil {
		commentsPtr = watchListItem.Comments
	}

	var ratingPtr *int32
	if watchListItem.Rating != nil {
		val := int32(*watchListItem.Rating)
		ratingPtr = &val
	}

	watchlistDTO := dto.WatchListDTO{
		MovieID:  watchListItem.MovieID,
		UserID:   watchListItem.UserID,
		Status:   watchListItem.Status,
		Favorite: watchListItem.Favorite,
		Comments: commentsPtr,
		Rating:   ratingPtr,
	}

	return watchlistDTO, nil
}

func (s *WatchListService) UpdateWatchlistItem(userID int32, movieID int, status string, favorite *bool, comments string, rating *int) (dto.WatchListDTO, error) {
	watchlistItem, err := s.repo.UpdateWatchlistItem(userID, movieID, status, favorite, comments, rating)
	if err != nil {
		return dto.WatchListDTO{}, err
	}

	var commentsPtr *string
	if watchlistItem.Comments != nil {
		commentsPtr = watchlistItem.Comments
	}

	var ratingPtr *int32
	if watchlistItem.Rating != nil {
		val := int32(*watchlistItem.Rating)
		ratingPtr = &val
	}

	watchlistDTO := dto.WatchListDTO{
		MovieID:  watchlistItem.MovieID,
		UserID:   watchlistItem.UserID,
		Status:   watchlistItem.Status,
		Favorite: watchlistItem.Favorite,
		Comments: commentsPtr,
		Rating:   ratingPtr,
	}

	return watchlistDTO, nil
}

func (s *WatchListService) RemoveFromWatchlist(userID int32, movieID int) error {
	return s.repo.RemoveFromWatchlist(userID, movieID)
}

func (s *WatchListService) UpdateStatus(userID int32, movieID int, status string) (dto.WatchListDTO, error) {
	watchlistItem, err := s.repo.UpdateStatus(userID, movieID, status)
	if err != nil {
		return dto.WatchListDTO{}, err
	}

	var commentsPtr *string
	if watchlistItem.Comments != nil {
		commentsPtr = watchlistItem.Comments
	}

	var ratingPtr *int32
	if watchlistItem.Rating != nil {
		val := int32(*watchlistItem.Rating)
		ratingPtr = &val
	}

	watchlistDTO := dto.WatchListDTO{
		MovieID:  watchlistItem.MovieID,
		UserID:   watchlistItem.UserID,
		Status:   watchlistItem.Status,
		Favorite: watchlistItem.Favorite,
		Comments: commentsPtr,
		Rating:   ratingPtr,
	}

	return watchlistDTO, nil
}

func (s *WatchListService) ToggleFavorite(userID int32, movieID int, favorite bool) (dto.WatchListDTO, error) {
	watchlistItem, err := s.repo.ToggleFavorite(userID, movieID, favorite)
	if err != nil {
		return dto.WatchListDTO{}, err
	}

	var commentsPtr *string
	if watchlistItem.Comments != nil {
		commentsPtr = watchlistItem.Comments
	}

	var ratingPtr *int32
	if watchlistItem.Rating != nil {
		val := int32(*watchlistItem.Rating)
		ratingPtr = &val
	}

	watchlistDTO := dto.WatchListDTO{
		MovieID:  watchlistItem.MovieID,
		UserID:   watchlistItem.UserID,
		Status:   watchlistItem.Status,
		Favorite: watchlistItem.Favorite,
		Comments: commentsPtr,
		Rating:   ratingPtr,
	}

	return watchlistDTO, nil
}

func (s *WatchListService) UpdateRating(userID int32, movieID int, rating *int) (dto.WatchListDTO, error) {
	watchlistItem, err := s.repo.UpdateRating(userID, movieID, rating)
	if err != nil {
		return dto.WatchListDTO{}, err
	}

	var commentsPtr *string
	if watchlistItem.Comments != nil {
		commentsPtr = watchlistItem.Comments
	}

	var ratingPtr *int32
	if watchlistItem.Rating != nil {
		val := int32(*watchlistItem.Rating)
		ratingPtr = &val
	}

	watchlistDTO := dto.WatchListDTO{
		MovieID:  watchlistItem.MovieID,
		UserID:   watchlistItem.UserID,
		Status:   watchlistItem.Status,
		Favorite: watchlistItem.Favorite,
		Comments: commentsPtr,
		Rating:   ratingPtr,
	}

	return watchlistDTO, nil
}

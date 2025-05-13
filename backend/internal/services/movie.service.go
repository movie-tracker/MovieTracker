package services

import (
	"github.com/movie-tracker/MovieTracker/internal/repositories"
	"github.com/movie-tracker/MovieTracker/internal/services/dto"
)

type IMovieService interface {
	IService
	GetByID(id int) (dto.MovieDTO, error)
}

type MovieService struct {
	movieRepo repositories.IMovieRepository
}

func newMovieService(params ServicesParams) IMovieService {
	return &MovieService{
		movieRepo: params.Repos.MovieRepo,
	}
}

func (s *MovieService) GetByID(id int) (dto.MovieDTO, error) {
	return s.movieRepo.GetByID(id)
}

func (s *MovieService) ProvideServices(svcs Services) {

}

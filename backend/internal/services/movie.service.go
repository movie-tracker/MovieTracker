package services

import (
	"github.com/movie-tracker/MovieTracker/internal/repositories"
	"github.com/movie-tracker/MovieTracker/internal/services/dto"
	"github.com/movie-tracker/MovieTracker/internal/services/mappers"
)

type IMovieService interface {
	IService
	GetByID(id int) (dto.MovieDTO, error)
	DiscoverMovies(page int) (dto.Pagination[dto.MovieDTO], error)
}

type MovieService struct {
	movieRepo repositories.IMovieRepository
}

func newMovieService(params ServicesParams) IMovieService {
	return &MovieService{
		movieRepo: params.Repos.MovieRepo,
	}
}

func (s *MovieService) DiscoverMovies(page int) (movies dto.Pagination[dto.MovieDTO], err error) {
	tmdbMovies, err := s.movieRepo.DiscoverMovies(page)
	if err != nil {
		return movies, err
	}

	movies.TotalPages = tmdbMovies.TotalPages
	movies.TotalResults = tmdbMovies.TotalResults
	movies.Page = tmdbMovies.Page
	movies.Results = mappers.MapFromTMDBToMovieDTOs(tmdbMovies.Results)

	return movies, nil
}

func (s *MovieService) GetByID(id int) (movie dto.MovieDTO, err error) {
	tmdbMovie, err := s.movieRepo.GetByID(id)

	if err != nil {
		return movie, err
	}

	movie = mappers.MapFromTMDBToMovieDTO(tmdbMovie)
	return movie, nil
}

func (s *MovieService) ProvideServices(svcs Services) {

}

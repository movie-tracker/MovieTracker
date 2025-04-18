package services

import "github.com/movie-tracker/MovieTracker/internal/repositories"

type IUserService interface {
}

type UserService struct {
	userRepo repositories.IUserRepository
}

func newUserService(params ServicesParams) IUserService {
	repos := params.Repos

	return UserService{
		userRepo: repos.UserRepo,
	}
}

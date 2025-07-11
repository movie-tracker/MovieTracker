package services

import (
	"github.com/go-jet/jet/v2/qrm"
	"github.com/movie-tracker/MovieTracker/internal/repositories"
	"github.com/movie-tracker/MovieTracker/internal/services/dto"
	"github.com/movie-tracker/MovieTracker/internal/utils"
	"golang.org/x/crypto/bcrypt"
)

const COST = 14

type IUserService interface {
	IService
	FindAll() ([]dto.UserDTO, error)
	FindByEmail(email string) (dto.UserDTO, error)
	FindByUsername(username string) (dto.UserDTO, error)
	Create(dto.UserCreateDTO) (dto.UserDTO, error)
	ValidatePassword(username string, password string) error
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

func (s UserService) ProvideServices(services Services) {}

func (s UserService) FindAll() ([]dto.UserDTO, error) {
	var err error
	var userDTOs = make([]dto.UserDTO, 0)

	users, err := s.userRepo.FindAll()
	if err != nil {
		return userDTOs, err
	}

	for _, user := range users {
		userDTOs = append(userDTOs, dto.UserDTO{
			ID:       user.ID,
			Username: user.Username,
			Email:    user.Email,
		})
	}

	return userDTOs, err
}

func (s UserService) FindByEmail(email string) (dto.UserDTO, error) {
	var err error
	var userDTO dto.UserDTO

	user, err := s.userRepo.FindByEmail(email)
	if err != nil {
		switch err {
		case qrm.ErrNoRows:
			return userDTO, utils.NewNotFoundError("error.user.not_found")
		default:
			return userDTO, err
		}
	}

	userDTO.FromModel(user)
	return userDTO, err
}

func (s UserService) FindByUsername(username string) (dto.UserDTO, error) {
	var err error
	var userDTO dto.UserDTO

	user, err := s.userRepo.FindByUsername(username)
	if err != nil {
		switch err {
		case qrm.ErrNoRows:
			return userDTO, utils.NewNotFoundError("error.user.not_found")
		default:
			return userDTO, err
		}
	}

	userDTO.FromModel(user)
	return userDTO, err
}

func (s UserService) Create(userDTO dto.UserCreateDTO) (createdUserDTO dto.UserDTO, err error) {
	user := userDTO.ToModel()

	createdUser, err := s.userRepo.Create(user)

	if err != nil {
		return
	}

	createdUserDTO.FromModel(createdUser)

	return
}

func (s UserService) ValidatePassword(username string, password string) error {
	var err error
	user, err := s.userRepo.FindByUsername(username)

	if err != nil {
		return utils.NewUnauthorizedError("error.auth.invalid_credentials")
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))

	if err != nil {
		return utils.NewUnauthorizedError("error.auth.invalid_credentials")
	}

	return nil
}

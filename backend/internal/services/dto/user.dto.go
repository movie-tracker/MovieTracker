package dto

import (
	"github.com/movie-tracker/MovieTracker/internal/database/movie-tracker/public/model"
	"golang.org/x/crypto/bcrypt"
)

type UserDTO struct {
	ID       int32  `json:"id"`
	Username string `json:"username"`
	Email    string `json:"email"`
}

func (u UserDTO) ToModel() model.Users {
	return model.Users{
		ID:       u.ID,
		Username: u.Username,
		Email:    u.Email,
	}
}

func (u *UserDTO) FromModel(user model.Users) {
	*u = UserDTO{
		ID:       user.ID,
		Username: user.Username,
		Email:    user.Email,
	}
}

type UserCreateDTO struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (u UserCreateDTO) ToModel() model.Users {
	passwdBytes := []byte(u.Password)
	password, _ := bcrypt.GenerateFromPassword(passwdBytes, 14)

	return model.Users{
		Username: u.Username,
		Email:    u.Email,
		Password: string(password),
	}
}

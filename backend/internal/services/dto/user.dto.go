package dto

import (
	"github.com/movie-tracker/MovieTracker/internal/database/movie-tracker/public/model"
	"golang.org/x/crypto/bcrypt"
)

type UserDTO struct {
	ID       int32   `json:"id"`
	Name     string  `json:"name"`
	Username string  `json:"username"`
	Email    string  `json:"email"`
	Phone    *string `json:"phone,omitempty"`
}

func (u UserDTO) ToModel() model.Users {
	return model.Users{
		ID:       u.ID,
		Name:     u.Name,
		Username: u.Username,
		Email:    u.Email,
		Phone:    u.Phone,
	}
}

func (u *UserDTO) FromModel(user model.Users) {
	*u = UserDTO{
		ID:       user.ID,
		Name:     user.Name,
		Username: user.Username,
		Email:    user.Email,
		Phone:    user.Phone,
	}
}

type UserCreateDTO struct {
	Name     string  `json:"name"`
	Username string  `json:"username"`
	Email    string  `json:"email"`
	Phone    *string `json:"phone,omitempty"`
	Password string  `json:"password"`
}

func (u UserCreateDTO) ToModel() model.Users {
	passwdBytes := []byte(u.Password)
	password, _ := bcrypt.GenerateFromPassword(passwdBytes, 14)

	return model.Users{
		Name:     u.Name,
		Username: u.Username,
		Email:    u.Email,
		Phone:    u.Phone,
		Password: string(password),
	}
}

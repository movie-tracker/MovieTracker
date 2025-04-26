package services

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/movie-tracker/MovieTracker/internal/utils"
)

type IAuthService interface {
	IService
	Login(username string, password string) (string, error)
}

type AuthService struct {
	userService  IUserService
	authSecret   []byte
	authTokenTTL time.Duration
}

func newAuthService(params ServicesParams) IAuthService {
	return &AuthService{
		authSecret:   []byte(params.Cfg.AuthSecret),
		authTokenTTL: time.Duration(params.Cfg.AuthTokenTTL) * time.Minute,
	}
}

func (s *AuthService) ProvideServices(services Services) {
	s.userService = services.UserService
}

type Claims struct {
	Username string `json:"username"`
	jwt.RegisteredClaims
}

func (s *AuthService) Login(username string, password string) (string, error) {
	// Verificar a senha
	if s.userService.ValidatePassword(username, password) != nil {
		return "", utils.NewUnauthorizedError("error.login.invalid_credentials")
	}

	// Criar as claims do JWT
	claims := &Claims{
		Username: username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(s.authTokenTTL)),
		},
	}

	// Gerar o token JWT
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(s.authSecret)
	if err != nil {
		return "", errors.New("error.login.token_generation_failed")
	}

	return tokenString, nil
}

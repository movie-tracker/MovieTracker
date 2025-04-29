package controllers

import (
	"github.com/gin-gonic/gin"
	"github.com/movie-tracker/MovieTracker/internal/services/dto"
)

func getRequester(ctx *gin.Context) (dto.UserDTO, bool) {
	var requester dto.UserDTO
	value, exists := ctx.Get("requester")
	if !exists {
		return dto.UserDTO{}, false
	}

	var ok bool
	if requester, ok = value.(dto.UserDTO); !ok {
		return dto.UserDTO{}, false
	}

	return requester, true
}

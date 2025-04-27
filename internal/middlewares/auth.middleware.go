package middlewares

import (
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/movie-tracker/MovieTracker/internal/services"
	"github.com/movie-tracker/MovieTracker/internal/utils"
)

func JwtAuthMiddleware(authService services.IAuthService) gin.HandlerFunc {
	return utils.MakeHandler(func(ctx *gin.Context) error {
		token := ctx.GetHeader("Authorization")
		var hasPrefix bool
		if token, hasPrefix = strings.CutPrefix(token, "Bearer "); !hasPrefix {
			return utils.NewUnauthorizedError("error.auth.missing_token")
		}

		username, err := authService.ValidateToken(token)
		if err != nil {
			return err
		}

		ctx.Set("username", username)
		ctx.Next()

		return nil
	})
}

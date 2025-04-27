package utils

import (
	"log/slog"

	"github.com/gin-gonic/gin"
)

func MakeHandler(f func(*gin.Context) error) gin.HandlerFunc {
	return func(c *gin.Context) {
		err := f(c)

		if err == nil {
			return
		}

		if apiErr, ok := err.(IApiError); ok {
			statusCode, response := apiErr.BuildError()
			c.JSON(statusCode, response)
			return
		}

		slog.Error("error handling request", "error", err)
		c.AbortWithError(500, err)
	}
}

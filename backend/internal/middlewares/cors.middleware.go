package middlewares

import (
	"github.com/gin-gonic/gin"
	"github.com/movie-tracker/MovieTracker/internal/config"
)

func CORSMiddleware(cfg config.ApiConfig) gin.HandlerFunc {
	allowOrigin := cfg.AllowOrigin
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", allowOrigin)
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "*")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

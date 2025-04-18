package main

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/movie-tracker/MovieTracker/internal/config"
	"github.com/movie-tracker/MovieTracker/internal/connections"
	"github.com/movie-tracker/MovieTracker/internal/repositories"
)

func main() {
	var cfg config.ApiConfig = config.NewApiConfig()

	conns := connections.NewConnections(cfg)
	repos := repositories.InitRepositories(&cfg, conns)

	server := gin.Default()
	server.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})

	address := fmt.Sprintf("%s:%d", cfg.Host, cfg.Port)
	server.Run(address)
}

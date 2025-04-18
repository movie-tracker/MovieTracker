package main

import (
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/movie-tracker/MovieTracker/internal/config"
	"github.com/movie-tracker/MovieTracker/internal/connections"
	"github.com/movie-tracker/MovieTracker/internal/controllers"
	"github.com/movie-tracker/MovieTracker/internal/repositories"
	"github.com/movie-tracker/MovieTracker/internal/services"
)

func main() {
	var cfg config.ApiConfig = config.NewApiConfig()

	conns := connections.NewConnections(cfg)
	repos := repositories.InitRepositories(cfg, conns)
	services := services.NewServices(cfg, conns, repos)
	controllers := controllers.NewControllers(cfg, services)

	server := gin.Default()

	controllers.Register(server, "/")

	address := fmt.Sprintf("%s:%d", cfg.Host, cfg.Port)
	server.Run(address)
}

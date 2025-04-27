package main

import (
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/movie-tracker/MovieTracker/internal/config"
	"github.com/movie-tracker/MovieTracker/internal/connections"
	"github.com/movie-tracker/MovieTracker/internal/controllers"
	"github.com/movie-tracker/MovieTracker/internal/middlewares"
	"github.com/movie-tracker/MovieTracker/internal/repositories"
	"github.com/movie-tracker/MovieTracker/internal/services"
	"github.com/movie-tracker/MovieTracker/internal/utils"
)

func main() {
	var err error

	// Load configuration
	var cfg config.ApiConfig = config.NewApiConfig()

	_connections, err := connections.NewConnections(cfg)

	utils.PanicOnError(err)

	_repositories := repositories.InitRepositories(cfg, _connections)
	_services := services.NewServices(cfg, _connections, _repositories)
	_controllers := controllers.NewControllers(cfg, _services)

	server := gin.Default()

	public := server.Group("/api")
	authenticated := server.Group("/api")
	authenticated.Use(middlewares.JwtAuthMiddleware(_services.AuthService))

	_controllers.RegisterHandlers(controllers.ControllerRegisterParams{
		Public:        public,
		Authenticated: authenticated,
	})

	address := fmt.Sprintf("%s:%d", cfg.Host, cfg.Port)
	server.Run(address)
}

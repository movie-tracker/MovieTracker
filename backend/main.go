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
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"

	_ "github.com/movie-tracker/MovieTracker/docs"
)

// @title           Movie Tracker API
// @version         1.0
// @description     A movie tracking API service
// @termsOfService  http://swagger.io/terms/

// @contact.name   API Support
// @contact.url    http://www.swagger.io/support
// @contact.email  support@swagger.io

// @license.name  Apache 2.0
// @license.url   http://www.apache.org/licenses/LICENSE-2.0.html

// @host      localhost:8888
// @BasePath  /api

// @securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization
// @description Type "Bearer" followed by a space and JWT token.

func main() {
	var err error

	// Load configuration
	var cfg config.ApiConfig = config.NewApiConfig()

	_connections, err := connections.NewConnections(cfg)

	utils.PanicOnError(err)

	_repositories := repositories.InitRepositories(cfg, _connections)
	_services := services.NewServices(cfg, _connections, _repositories)
	_controllers := controllers.NewControllers(cfg, _services)

	utils.RegisterValidations()
	server := gin.Default()
	server.Use(middlewares.CORSMiddleware(cfg))

	public := server.Group("/api")
	authenticated := server.Group("/api")
	authenticated.Use(middlewares.JwtAuthMiddleware(_services.AuthService))

	_controllers.RegisterHandlers(controllers.ControllerRegisterParams{
		Public:        public,
		Authenticated: authenticated,
	})

	// Swagger endpoint
	server.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	address := fmt.Sprintf("%s:%d", cfg.Host, cfg.Port)
	server.Run(address)
}

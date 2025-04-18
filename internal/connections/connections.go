package connections

import (
	"database/sql"
	"fmt"

	_ "github.com/lib/pq"
	"github.com/movie-tracker/MovieTracker/internal/config"
)

type Connections struct {
	DB *sql.DB
}

func NewConnections(cfg config.ApiConfig) Connections {
	connStr := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		cfg.Database.Host, cfg.Database.Port, cfg.Database.User, cfg.Database.Password, cfg.Database.Name)

	db, err := sql.Open("postgres", connStr)

	if err != nil {
		panic(err)
	}

	return Connections{
		DB: db,
	}
}

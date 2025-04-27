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

func NewConnections(cfg config.ApiConfig) (conns Connections, err error) {
	connStr := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		cfg.Database.Host, cfg.Database.Port, cfg.Database.User, cfg.Database.Password, cfg.Database.Name)

	conns.DB, err = sql.Open("postgres", connStr)

	if err != nil {
		return
	}

	return
}

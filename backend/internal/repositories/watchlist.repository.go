package repositories

import (
    "database/sql"
    "fmt"

    "github.com/go-jet/jet/v2/postgres" // Importação para as funções do Postgres
    . "github.com/go-jet/jet/v2/postgres" // Dot import para facilitar o uso
    "github.com/movie-tracker/MovieTracker/internal/database/movie-tracker/public/enum"
    "github.com/movie-tracker/MovieTracker/internal/database/movie-tracker/public/model"
    "github.com/movie-tracker/MovieTracker/internal/database/movie-tracker/public/table"
    "github.com/movie-tracker/MovieTracker/internal/services/dto"
)

type IWatchListRepository interface {
	GetByUser(userID int32) ([]model.Watchlist, error)
	AddToWatchlist(userID int32, createDTO dto.WatchListCreateDTO) (model.Watchlist, error)
	UpdateWatchlistItem(userID int32, movieID int, status string, favorite *bool, comments string, rating *int) (model.Watchlist, error)
	RemoveFromWatchlist(userID int32, movieID int) error
	UpdateStatus(userID int32, movieID int, status string) (model.Watchlist, error)
	ToggleFavorite(userID int32, movieID int, favorite bool) (model.Watchlist, error)
	UpdateRating(userID int32, movieID int, rating *int) (model.Watchlist, error)
}

type WatchListRepository struct {
	DB *sql.DB
}

func newWatchListRepository(params RepositoryParams) IWatchListRepository {
	return &WatchListRepository{
		DB: params.DB,
	}
}

func (r *WatchListRepository) GetByUser(userID int32) ([]model.Watchlist, error) {
	qb := SELECT(table.Watchlist.AllColumns).
		FROM(table.Watchlist).
		WHERE(table.Watchlist.UserID.EQ(Int32(userID)))

	var watchList []model.Watchlist
	err := qb.Query(r.DB, &watchList)

	return watchList, err
}

func (r *WatchListRepository) AddToWatchlist(userID int32, createDTO dto.WatchListCreateDTO) (model.Watchlist, error) {
	var watchlistItem model.Watchlist
	watchlistModel := model.Watchlist{
		MovieID:  createDTO.MovieID,
		UserID:   userID,
		Status:   createDTO.Status,
		Favorite: createDTO.Favorite,
		Comments: createDTO.Comments,
		Rating:   createDTO.Rating,
	}

	insertStatement := table.Watchlist.INSERT(
		table.Watchlist.UserID,
		table.Watchlist.MovieID,
		table.Watchlist.Status,
		table.Watchlist.Favorite,
		table.Watchlist.Comments,
		table.Watchlist.Rating,
	).MODEL(watchlistModel).
		RETURNING(table.Watchlist.AllColumns)

	err := insertStatement.Query(r.DB, &watchlistItem)
	return watchlistItem, err
}

func (r *WatchListRepository) UpdateWatchlistItem(userID int32, movieID int, status string, favorite *bool, comments string, rating *int) (model.Watchlist, error) {
	var watchlistItem model.Watchlist

	fmt.Printf("🔍 DEBUG: Repository - Parâmetros recebidos - Status: '%s', Favorite: %v, Comments: '%s', Rating: %v\n",
		status, favorite, comments, rating)
	fmt.Printf("🔍 DEBUG: Repository - UserID: %d, MovieID: %d\n", userID, movieID)

	// First, check if the item exists
	checkStmt := SELECT(table.Watchlist.AllColumns).
		FROM(table.Watchlist).
		WHERE(table.Watchlist.MovieID.EQ(Int32(int32(movieID))).AND(table.Watchlist.UserID.EQ(Int32(userID))))

	var existingItem model.Watchlist
	err := checkStmt.Query(r.DB, &existingItem)
	if err != nil {
		if err == sql.ErrNoRows {
			return model.Watchlist{}, fmt.Errorf("watchlist item not found for movie_id=%d and user_id=%d", movieID, userID)
		}
		return model.Watchlist{}, err
	}

	fmt.Printf("🔍 DEBUG: Item encontrado - Status atual: '%s', Favorite: %v, Comments: '%s', Rating: %v\n",
		existingItem.Status, existingItem.Favorite, existingItem.Comments, existingItem.Rating)
	
	// Create a slice of assignable expressions
	assignments := []interface{}{}

	if status != "" {
		var statusEnum postgres.StringExpression
		switch status {
		case "unwatched":
			statusEnum = enum.WatchStatus.Unwatched
		case "watching":
			statusEnum = enum.WatchStatus.Watching
		case "plan to watch":
			statusEnum = enum.WatchStatus.PlanToWatch
		case "watched":
			statusEnum = enum.WatchStatus.Watched
		default:
			return model.Watchlist{}, fmt.Errorf("invalid status: %s", status)
		}
		assignments = append(assignments, table.Watchlist.Status.SET(statusEnum))
	}
	if favorite != nil {
		assignments = append(assignments, table.Watchlist.Favorite.SET(Bool(*favorite)))
	}
	if comments != "" {
		assignments = append(assignments, table.Watchlist.Comments.SET(String(comments)))
	}
	if rating != nil {
		assignments = append(assignments, table.Watchlist.Rating.SET(Int32(int32(*rating))))
	}

	if len(assignments) == 0 {
		fmt.Println("🔍 DEBUG: Nenhuma alteração foi solicitada, retornando o item existente.")
		return existingItem, nil
	}
	
	// Build the UPDATE statement with a single SET call
	updateStmt := table.Watchlist.UPDATE().
		SET(assignments[0], assignments[1:]...).
		WHERE(table.Watchlist.MovieID.EQ(Int32(int32(movieID))).AND(table.Watchlist.UserID.EQ(Int32(userID)))).
		RETURNING(table.Watchlist.AllColumns)

	// Log the generated SQL query
	sql, args := updateStmt.Sql()
	fmt.Printf("🔍 DEBUG: SQL Query: %s\n", sql)
	fmt.Printf("🔍 DEBUG: SQL Args: %v\n", args)
	fmt.Printf("🔍 DEBUG: Número de argumentos SQL: %d\n", len(args))

	err = updateStmt.Query(r.DB, &watchlistItem)

	if err != nil {
		fmt.Printf("❌ DEBUG: Erro na query: %v\n", err)
		return model.Watchlist{}, err
	}

	fmt.Printf("🔍 DEBUG: Repository - Resultado - Status: '%s', Favorite: %v, Comments: '%s', Rating: %v\n",
		watchlistItem.Status, watchlistItem.Favorite, watchlistItem.Comments, watchlistItem.Rating)

	return watchlistItem, err
}

func (r *WatchListRepository) RemoveFromWatchlist(userID int32, movieID int) error {
	deleteStmt := table.Watchlist.DELETE().
		WHERE(table.Watchlist.MovieID.EQ(Int32(int32(movieID))).AND(table.Watchlist.UserID.EQ(Int32(userID))))

	_, err := deleteStmt.Exec(r.DB)
	return err
}

func (r *WatchListRepository) UpdateStatus(userID int32, movieID int, status string) (model.Watchlist, error) {
	var watchlistItem model.Watchlist

	// Converter string para enum value
	var statusEnum postgres.StringExpression
	switch status {
	case "unwatched":
		statusEnum = enum.WatchStatus.Unwatched
	case "watching":
		statusEnum = enum.WatchStatus.Watching
	case "plan to watch":
		statusEnum = enum.WatchStatus.PlanToWatch
	case "watched":
		statusEnum = enum.WatchStatus.Watched
	default:
		return model.Watchlist{}, fmt.Errorf("invalid status: %s", status)
	}

	updateStmt := table.Watchlist.UPDATE().
		SET(table.Watchlist.Status.SET(statusEnum)).
		WHERE(table.Watchlist.MovieID.EQ(Int32(int32(movieID))).AND(table.Watchlist.UserID.EQ(Int32(userID)))).
		RETURNING(table.Watchlist.AllColumns)

	err := updateStmt.Query(r.DB, &watchlistItem)
	return watchlistItem, err
}

func (r *WatchListRepository) ToggleFavorite(userID int32, movieID int, favorite bool) (model.Watchlist, error) {
	var watchlistItem model.Watchlist

	updateStmt := table.Watchlist.UPDATE().
		SET(table.Watchlist.Favorite.SET(Bool(favorite))).
		WHERE(table.Watchlist.MovieID.EQ(Int32(int32(movieID))).AND(table.Watchlist.UserID.EQ(Int32(userID)))).
		RETURNING(table.Watchlist.AllColumns)

	err := updateStmt.Query(r.DB, &watchlistItem)
	return watchlistItem, err
}

func (r *WatchListRepository) UpdateRating(userID int32, movieID int, rating *int) (model.Watchlist, error) {
	var watchlistItem model.Watchlist

	updateStmt := table.Watchlist.UPDATE().
		WHERE(table.Watchlist.MovieID.EQ(Int32(int32(movieID))).AND(table.Watchlist.UserID.EQ(Int32(userID))))

	if rating != nil {
		updateStmt = updateStmt.SET(table.Watchlist.Rating.SET(Int32(int32(*rating))))
	} else {
		updateStmt = updateStmt.SET(table.Watchlist.Rating.SET(CAST(NULL).AS_INTEGER()))
	}

	updateStmt = updateStmt.RETURNING(table.Watchlist.AllColumns)

	err := updateStmt.Query(r.DB, &watchlistItem)
	return watchlistItem, err
}

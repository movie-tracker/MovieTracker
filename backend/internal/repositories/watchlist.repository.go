package repositories

import (
	"database/sql"

	. "github.com/go-jet/jet/v2/postgres"
	"github.com/movie-tracker/MovieTracker/internal/database/movie-tracker/public/model"
	"github.com/movie-tracker/MovieTracker/internal/database/movie-tracker/public/table"
	"github.com/movie-tracker/MovieTracker/internal/services/dto"
)

type IWatchListRepository interface {
	GetByUser(userID int64) ([]model.Watchlist, error)
	AddToWatchlist(userID int64, createDTO dto.WatchListCreateDTO) (model.Watchlist, error)
	UpdateWatchlistItem(userID int64, id int, status string, favorite *bool, comments string, rating *int) (model.Watchlist, error)
	RemoveFromWatchlist(userID int64, id int) error
	UpdateStatus(userID int64, id int, status string) (model.Watchlist, error)
	ToggleFavorite(userID int64, id int, favorite bool) (model.Watchlist, error)
	UpdateRating(userID int64, id int, rating *int) (model.Watchlist, error)
}

type WatchListRepository struct {
	DB *sql.DB
}

func newWatchListRepository(params RepositoryParams) IWatchListRepository {
	return &WatchListRepository{
		DB: params.DB,
	}
}

func (r *WatchListRepository) GetByUser(userID int64) ([]model.Watchlist, error) {
	qb := SELECT(table.Watchlist.AllColumns).
		FROM(table.Watchlist).
		WHERE(table.Watchlist.UserID.EQ(Int(userID)))

	var watchList []model.Watchlist
	err := qb.Query(r.DB, &watchList)

	return watchList, err
}

func (r *WatchListRepository) AddToWatchlist(userID int64, createDTO dto.WatchListCreateDTO) (model.Watchlist, error) {
	var watchlistItem model.Watchlist
	var model = model.Watchlist{
		MovieID:  &createDTO.MovieID,
		UserID:   int32(userID),
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
	).MODEL(model).
		RETURNING(table.Watchlist.AllColumns)

	err := insertStatement.Query(r.DB, &watchlistItem)
	return watchlistItem, err
}

func (r *WatchListRepository) UpdateWatchlistItem(userID int64, id int, status string, favorite *bool, comments string, rating *int) (model.Watchlist, error) {
	var watchlistItem model.Watchlist

	updateStmt := table.Watchlist.UPDATE().
		WHERE(table.Watchlist.ID.EQ(Int32(int32(id))).AND(table.Watchlist.UserID.EQ(Int(userID))))

	if status != "" {
		updateStmt = updateStmt.SET(table.Watchlist.Status.SET(String(status)))
	}
	if favorite != nil {
		updateStmt = updateStmt.SET(table.Watchlist.Favorite.SET(Bool(*favorite)))
	}
	if comments != "" {
		updateStmt = updateStmt.SET(table.Watchlist.Comments.SET(String(comments)))
	}
	if rating != nil {
		updateStmt = updateStmt.SET(table.Watchlist.Rating.SET(Int32(int32(*rating))))
	}

	updateStmt = updateStmt.RETURNING(table.Watchlist.AllColumns)

	err := updateStmt.Query(r.DB, &watchlistItem)
	return watchlistItem, err
}

func (r *WatchListRepository) RemoveFromWatchlist(userID int64, id int) error {
	deleteStmt := table.Watchlist.DELETE().
		WHERE(table.Watchlist.ID.EQ(Int32(int32(id))).AND(table.Watchlist.UserID.EQ(Int(userID))))

	_, err := deleteStmt.Exec(r.DB)
	return err
}

func (r *WatchListRepository) UpdateStatus(userID int64, id int, status string) (model.Watchlist, error) {
	var watchlistItem model.Watchlist

	updateStmt := table.Watchlist.UPDATE().
		SET(table.Watchlist.Status.SET(String(status))).
		WHERE(table.Watchlist.ID.EQ(Int32(int32(id))).AND(table.Watchlist.UserID.EQ(Int(userID)))).
		RETURNING(table.Watchlist.AllColumns)

	err := updateStmt.Query(r.DB, &watchlistItem)
	return watchlistItem, err
}

func (r *WatchListRepository) ToggleFavorite(userID int64, id int, favorite bool) (model.Watchlist, error) {
	var watchlistItem model.Watchlist

	updateStmt := table.Watchlist.UPDATE().
		SET(table.Watchlist.Favorite.SET(Bool(favorite))).
		WHERE(table.Watchlist.ID.EQ(Int32(int32(id))).AND(table.Watchlist.UserID.EQ(Int(userID)))).
		RETURNING(table.Watchlist.AllColumns)

	err := updateStmt.Query(r.DB, &watchlistItem)
	return watchlistItem, err
}

func (r *WatchListRepository) UpdateRating(userID int64, id int, rating *int) (model.Watchlist, error) {
	var watchlistItem model.Watchlist

	updateStmt := table.Watchlist.UPDATE().
		WHERE(table.Watchlist.ID.EQ(Int32(int32(id))).AND(table.Watchlist.UserID.EQ(Int(userID))))

	if rating != nil {
		updateStmt = updateStmt.SET(table.Watchlist.Rating.SET(Int32(int32(*rating))))
	} else {
		updateStmt = updateStmt.SET(table.Watchlist.Rating.SET(CAST(NULL).AS_INTEGER()))
	}

	updateStmt = updateStmt.RETURNING(table.Watchlist.AllColumns)

	err := updateStmt.Query(r.DB, &watchlistItem)
	return watchlistItem, err
}

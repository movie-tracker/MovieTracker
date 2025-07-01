package repositories

import (
	"database/sql"

	. "github.com/go-jet/jet/v2/postgres"
	"github.com/movie-tracker/MovieTracker/internal/database/movie-tracker/public/model"
	"github.com/movie-tracker/MovieTracker/internal/database/movie-tracker/public/table"
)

type IUserRepository interface {
	FindAll() ([]model.Users, error)
	FindOne(int32) (model.Users, error)
	FindByEmail(string) (model.Users, error)
	FindByUsername(string) (model.Users, error)
	Create(user model.Users) (model.Users, error)
	Update(user model.Users) (model.Users, error)
}

type UserRepository struct {
	DB *sql.DB
}

func newUserRepository(params RepositoryParams) IUserRepository {
	return UserRepository{
		DB: params.DB,
	}
}

func (r UserRepository) FindAll() ([]model.Users, error) {
	var err error
	var users []model.Users

	qb := SELECT(table.Users.AllColumns).FROM(table.Users)

	err = qb.Query(r.DB, &users)

	return users, err
}

func (r UserRepository) FindOne(id int32) (model.Users, error) {
	var err error
	var user model.Users

	qb := SELECT(table.Users.AllColumns).FROM(table.Users).WHERE(table.Users.ID.EQ(Int32(id)))

	err = qb.Query(r.DB, &user)

	return user, err
}

func (r UserRepository) FindByEmail(email string) (model.Users, error) {
	var err error
	var user model.Users

	qb := SELECT(table.Users.AllColumns).FROM(table.Users).WHERE(table.Users.Email.EQ(String(email)))

	err = qb.Query(r.DB, &user)

	return user, err
}

func (r UserRepository) FindByUsername(username string) (model.Users, error) {
	var err error
	var user model.Users

	qb := SELECT(table.Users.AllColumns).
		FROM(table.Users).
		WHERE(table.Users.Username.EQ(String(username)))
	err = qb.Query(r.DB, &user)

	return user, err
}

func (r UserRepository) Create(user model.Users) (model.Users, error) {
	var err error
	var createdUser model.Users

	err = table.Users.INSERT(table.Users.MutableColumns).MODEL(user).RETURNING(table.Users.AllColumns).Query(r.DB, &createdUser)

	return createdUser, err
}

func (r UserRepository) Update(user model.Users) (model.Users, error) {
	var err error
	var updatedUser model.Users

	err = table.Users.UPDATE(table.Users.AllColumns).MODEL(user).WHERE(table.Users.ID.EQ(Int32(user.ID))).RETURNING(table.Users.AllColumns).Query(r.DB, &updatedUser)

	return updatedUser, err
}

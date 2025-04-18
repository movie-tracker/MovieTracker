package repositories

import "database/sql"

type IUserRepository interface {
	// FindAll()
	// FindOne(id int)
	// FindByEmail(email string)
}

type UserRepository struct {
	DB *sql.DB
}

func newUserRepository(params RepositoryParams) IUserRepository {
	return UserRepository{
		DB: params.DB,
	}
}

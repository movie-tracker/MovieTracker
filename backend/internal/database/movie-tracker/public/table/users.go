//
// Code generated by go-jet DO NOT EDIT.
//
// WARNING: Changes to this file may cause incorrect behavior
// and will be lost if the code is regenerated
//

package table

import (
	"github.com/go-jet/jet/v2/postgres"
)

var Users = newUsersTable("public", "users", "")

type usersTable struct {
	postgres.Table

	// Columns
	ID        postgres.ColumnInteger
	Name      postgres.ColumnString
	Username  postgres.ColumnString
	Phone     postgres.ColumnString
	Email     postgres.ColumnString
	Password  postgres.ColumnString
	CreatedAt postgres.ColumnTimestamp
	UpdatedAt postgres.ColumnTimestamp
	DeletedAt postgres.ColumnTimestamp

	AllColumns     postgres.ColumnList
	MutableColumns postgres.ColumnList
}

type UsersTable struct {
	usersTable

	EXCLUDED usersTable
}

// AS creates new UsersTable with assigned alias
func (a UsersTable) AS(alias string) *UsersTable {
	return newUsersTable(a.SchemaName(), a.TableName(), alias)
}

// Schema creates new UsersTable with assigned schema name
func (a UsersTable) FromSchema(schemaName string) *UsersTable {
	return newUsersTable(schemaName, a.TableName(), a.Alias())
}

// WithPrefix creates new UsersTable with assigned table prefix
func (a UsersTable) WithPrefix(prefix string) *UsersTable {
	return newUsersTable(a.SchemaName(), prefix+a.TableName(), a.TableName())
}

// WithSuffix creates new UsersTable with assigned table suffix
func (a UsersTable) WithSuffix(suffix string) *UsersTable {
	return newUsersTable(a.SchemaName(), a.TableName()+suffix, a.TableName())
}

func newUsersTable(schemaName, tableName, alias string) *UsersTable {
	return &UsersTable{
		usersTable: newUsersTableImpl(schemaName, tableName, alias),
		EXCLUDED:   newUsersTableImpl("", "excluded", ""),
	}
}

func newUsersTableImpl(schemaName, tableName, alias string) usersTable {
	var (
		IDColumn        = postgres.IntegerColumn("id")
		NameColumn      = postgres.StringColumn("name")
		UsernameColumn  = postgres.StringColumn("username")
		PhoneColumn     = postgres.StringColumn("phone")
		EmailColumn     = postgres.StringColumn("email")
		PasswordColumn  = postgres.StringColumn("password")
		CreatedAtColumn = postgres.TimestampColumn("created_at")
		UpdatedAtColumn = postgres.TimestampColumn("updated_at")
		DeletedAtColumn = postgres.TimestampColumn("deleted_at")
		allColumns      = postgres.ColumnList{IDColumn, NameColumn, UsernameColumn, PhoneColumn, EmailColumn, PasswordColumn, CreatedAtColumn, UpdatedAtColumn, DeletedAtColumn}
		mutableColumns  = postgres.ColumnList{NameColumn, UsernameColumn, PhoneColumn, EmailColumn, PasswordColumn, CreatedAtColumn, UpdatedAtColumn, DeletedAtColumn}
	)

	return usersTable{
		Table: postgres.NewTable(schemaName, tableName, alias, allColumns...),

		//Columns
		ID:        IDColumn,
		Name:      NameColumn,
		Username:  UsernameColumn,
		Phone:     PhoneColumn,
		Email:     EmailColumn,
		Password:  PasswordColumn,
		CreatedAt: CreatedAtColumn,
		UpdatedAt: UpdatedAtColumn,
		DeletedAt: DeletedAtColumn,

		AllColumns:     allColumns,
		MutableColumns: mutableColumns,
	}
}

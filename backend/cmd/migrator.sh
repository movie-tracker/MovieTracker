#!/bin/bash

source .env

migrator="goose"
migration_dir="./internal/migrations"
db_driver="postgres"
connection_string="user=$DB_USER dbname=$DB_NAME host=$DB_HOST port=$DB_PORT password=$DB_PASSWORD"

if ! command -v $migrator 2>&1 >/dev/null
then
  echo "execute to install goose 'go install github.com/pressly/goose/v3/cmd/goose@latest'"
fi

goose -dir $migration_dir $db_driver "$connection_string" $@
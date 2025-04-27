include .env

DOCKER_ENV_FILE=.env
DOCKER_COMPOSE_FILE=./.docker/docker-compose.yml
DOCKER_PROJECT_NAME=movie-tracker
DC=docker compose -f $(DOCKER_COMPOSE_FILE) --env-file $(DOCKER_ENV_FILE) -p $(DOCKER_PROJECT_NAME)

JET_PATH=./internal/database
JET_CONSTR=postgresql://$(DB_USER):$(DB_PASSWORD)@$(DB_HOST):$(DB_PORT)/$(DB_NAME)?sslmode=disable
JET=jet -dsn=$(JET_CONSTR) -schema=public -path=$(JET_PATH)


.PHONY: run
run:
	@air || echo "air is not installed"


.PHONY: compose_up
compose_up:
	$(DC) up -d --force-recreate


.PHONY: compose_build
compose_build:
	$(DC) up -d --force-recreate --build


.PHONY: compose_down
compose_down:
	$(DC) down


.PHONY: update_database
update_database:
	$(JET)


.PHONY: remake_database
remake_database:

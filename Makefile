include backend/.env

DOCKER_ENV_FILE=backend/.env
DOCKER_COMPOSE_FILE=./.docker/docker-compose.yml
DOCKER_PROJECT_NAME=movie-tracker
DC=docker compose -f $(DOCKER_COMPOSE_FILE) --env-file $(DOCKER_ENV_FILE) -p $(DOCKER_PROJECT_NAME)

# Docker
.PHONY: compose_up
compose_up:
	$(DC) up -d --force-recreate


.PHONY: compose_build
compose_build:
	$(DC) up -d --force-recreate --build


.PHONY: compose_down
compose_down:
	$(DC) down

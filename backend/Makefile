include .env

JET_PATH=./internal/database
JET_CONSTR=postgresql://$(DB_USER):$(DB_PASSWORD)@$(DB_HOST):$(DB_PORT)/$(DB_NAME)?sslmode=disable
JET=jet -dsn=$(JET_CONSTR) -schema=public -path=$(JET_PATH)

GO_ENTRYPOINT=main.go
GO_FLAGS=

OUTPUT_DIR=./bin
OUTPUT_FILE=$(OUTPUT_DIR)/movie-tracker-api


.PHONY: run
run:
	@air || echo "air is not installed"

.PHONY: build
build: always
	go build $(GO_FLAGS) -o $(OUTPUT_FILE) $(GO_ENTRYPOINT)

.PHONY: clean
clean:
	rm -rf $(OUTPUT_DIR)

.PHONY: always
always:
	mkdir -p $(OUTPUT_DIR)


.PHONY: update_database
update_database:
	$(JET)


.PHONY: remake_database

.PHONY: swagger
swagger:
	swag init

.PHONY: swagger-serve
swagger-serve: swagger
	@echo "Starting server with Swagger documentation..."
	@echo "Swagger UI will be available at: http://localhost:8080/swagger/index.html"
	@$(MAKE) run

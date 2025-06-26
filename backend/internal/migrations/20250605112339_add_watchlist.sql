-- +goose Up
-- +goose StatementBegin

CREATE TYPE watch_status as ENUM ('unwatched', 'watching', 'plan to watch', 'watched');

CREATE TABLE "watchlist" (
  "movie_id" int not null,
  "user_id" int not null,
  "status" watch_status default 'unwatched' not null,
  "favorite" boolean default false not null,
  "comments" varchar,
  "rating" int,
  PRIMARY KEY ("movie_id", "user_id")
);

ALTER TABLE "watchlist" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");


-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin

DROP TABLE watchlist;
DROP TYPE watch_status;

-- +goose StatementEnd

-- +goose Up
-- +goose StatementBegin

CREATE TYPE watch_status as ENUM ('unwatched', 'watching', 'plan to watch', 'watched');

CREATE TABLE "watchlist" (
  "id" serial primary KEY,
  "movie_id" int,
  "user_id" int not null,
  "status" watch_status default 'unwatched' not null,
  "favorite" boolean default false not null,
  "comments" varchar default '' not null,
  "rating" int
);

ALTER TABLE "watchlist" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");


-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin

DROP TABLE watchlist;
DROP TYPE watch_status;

-- +goose StatementEnd

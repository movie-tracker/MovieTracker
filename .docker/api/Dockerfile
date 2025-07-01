FROM golang:1.24
WORKDIR /api

RUN apt-get update -qq
RUN apt-get install libc6-dev -y

COPY go.mod go.sum ./
RUN go mod download && go mod verify

COPY . .

RUN make build

ENTRYPOINT ["bin/movie-tracker-api"]

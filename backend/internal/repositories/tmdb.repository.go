package repositories

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"

	"github.com/movie-tracker/MovieTracker/internal/services/dto"
	"github.com/movie-tracker/MovieTracker/internal/utils"
)

type IMovieRepository interface {
	GetByID(id int) (dto.MovieDTO, error)
	DiscoverMovies() (dto.Pagination[dto.MovieDTO], error)
}

type TMDBRepository struct {
	baseURL  string
	apiToken string
}

func newTMDBRepository(params RepositoryParams) *TMDBRepository {
	return &TMDBRepository{
		baseURL:  "https://api.themoviedb.org/3",
		apiToken: params.cfg.TMDB.ApiKey,
	}
}

func (r *TMDBRepository) login() error {
	endpoint, err := r.getEndpoint("/authentication")
	if err != nil {
		return err
	}

	response, err := r.fetchNoRetry("GET", endpoint, nil)
	defer response.Body.Close()

	if response.StatusCode != http.StatusOK {
		return fmt.Errorf("api error (code: %d)", response.StatusCode)
	}

	var body struct {
		Success bool `json:"success"`
	}

	if err = json.NewDecoder(response.Body).Decode(&body); err != nil {
		return err
	}

	if !body.Success {
		return fmt.Errorf("Failed to login")
	}

	return nil
}

func (r *TMDBRepository) DiscoverMovies() (dto.Pagination[dto.MovieDTO], error) {
	var err error
	var movies dto.Pagination[dto.MovieDTO]
	endpoint, err := r.getEndpoint("/discover/movie")
	if err != nil {
		return movies, err
	}

	response, err := r.fetch("GET", endpoint, nil)
	if err != nil {
		return movies, err
	}
	defer response.Body.Close()

	err = utils.GetBodyJSON(response, &movies)
	if err != nil {
		return movies, fmt.Errorf("failed to decode movie data: %w", err)
	}

	return movies, nil
}

func (r *TMDBRepository) GetByID(id int) (dto.MovieDTO, error) {
	endpoint, err := r.getEndpoint("/movie/%d", id)
	if err != nil {
		return dto.MovieDTO{}, err
	}

	response, err := r.fetch("GET", endpoint, nil)

	if err != nil {
		return dto.MovieDTO{}, err
	}

	defer response.Body.Close()
	if response.StatusCode != http.StatusOK {
		return dto.MovieDTO{}, fmt.Errorf("failed to fetch movie data: %s", response.Status)
	}

	var movie dto.MovieDTO
	if err := json.NewDecoder(response.Body).Decode(&movie); err != nil {
		return dto.MovieDTO{}, fmt.Errorf("failed to decode movie data: %w", err)
	}

	return movie, nil
}

func (r *TMDBRepository) getEndpoint(path string, args ...any) (string, error) {
	return url.JoinPath(r.baseURL, fmt.Sprintf(path, args...))
}

func (r *TMDBRepository) fetchNoRetry(method string, endpoint string, body io.Reader) (*http.Response, error) {
	client := http.Client{}
	req, err := http.NewRequest(method, endpoint, body)
	if err != nil {
		return nil, err
	}

	authorization := fmt.Sprintf("Bearer %s", r.apiToken)
	req.Header.Set("Authorization", authorization)

	resp, err := client.Do(req)

	return resp, err
}

func (r *TMDBRepository) fetch(method string, endpoint string, body io.Reader) (*http.Response, error) {
	resp, err := r.fetchNoRetry(method, endpoint, body)
	if err != nil {
		return nil, err
	}

	if resp.StatusCode == http.StatusUnauthorized {
		r.login()
	}

	return r.fetchNoRetry(method, endpoint, body)
}

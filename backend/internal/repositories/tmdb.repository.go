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
	DiscoverMovies(page int) (dto.Pagination[dto.TMDBMovieDTO], error)
	GetByID(id int) (dto.TMDBMovieDTO, error)
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

func (r *TMDBRepository) DiscoverMovies(page int) (dto.Pagination[dto.TMDBMovieDTO], error) {
	var err error
	var movies dto.Pagination[dto.TMDBMovieDTO]

	// Construir URL com parâmetros de paginação
	endpoint, err := r.getEndpoint("/discover/movie")
	if err != nil {
		return movies, err
	}

	// Adicionar parâmetros de query
	u, err := url.Parse(endpoint)
	if err != nil {
		return movies, err
	}

	q := u.Query()
	q.Set("page", fmt.Sprintf("%d", page))
	q.Set("sort_by", "popularity.desc")
	q.Set("include_adult", "false")
	q.Set("include_video", "false")
	q.Set("language", "pt-BR")
	q.Set("region", "BR")
	q.Set("certification_country", "BR")
	q.Set("certification.lte", "12")
	q.Set("with_release_type", "2|3")
	q.Set("without_genres", "27,10749,10751")
	q.Set("vote_count.gte", "10")

	u.RawQuery = q.Encode()

	fmt.Printf("🔍 DEBUG: URL da API TMDB: %s\n", u.String())

	response, err := r.fetch("GET", u.String(), nil)
	if err != nil {
		return movies, err
	}
	defer response.Body.Close()

	err = utils.GetBodyJSON(response, &movies)
	if err != nil {
		return movies, fmt.Errorf("failed to decode movie data: %w", err)
	}

	var filteredResults []dto.TMDBMovieDTO
	for _, movie := range movies.Results {
		if !movie.Adult {
			filteredResults = append(filteredResults, movie)
		} else {
			fmt.Printf("🚫 DEBUG: Filme adulto filtrado: %s (ID: %d)\n", movie.Title, movie.ID)
		}
	}

	movies.Results = filteredResults
	movies.TotalResults = len(filteredResults)

	fmt.Printf("✅ DEBUG: Total de filmes retornados: %d (após filtro)\n", len(filteredResults))

	return movies, nil
}

func (r *TMDBRepository) GetByID(id int) (dto.TMDBMovieDTO, error) {
	var movie dto.TMDBMovieDTO
	endpoint, err := r.getEndpoint("/movie/%d", id)
	if err != nil {
		return movie, err
	}

	u, err := url.Parse(endpoint)
	if err != nil {
		return movie, err
	}

	q := u.Query()
	q.Set("language", "pt-BR")
	q.Set("append_to_response", "translations")

	u.RawQuery = q.Encode()

	fmt.Printf("🔍 DEBUG: URL da API TMDB (GetByID): %s\n", u.String())

	response, err := r.fetch("GET", u.String(), nil)

	if err != nil {
		return movie, err
	}

	defer response.Body.Close()
	if response.StatusCode != http.StatusOK {
		return movie, fmt.Errorf("failed to fetch movie data: %s", response.Status)
	}

	if err := json.NewDecoder(response.Body).Decode(&movie); err != nil {
		return movie, fmt.Errorf("failed to decode movie data: %w", err)
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

package repositories

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"

	"github.com/movie-tracker/MovieTracker/internal/services/dto"
	"github.com/movie-tracker/MovieTracker/internal/utils"
)

type IMovieRepository interface {
	DiscoverMovies(page int) (dto.Pagination[dto.TMDBMovieDTO], error)
	GetByID(id int) (dto.TMDBMovieDTO, error)
	SearchMovies(query string, page int) (dto.Pagination[dto.TMDBMovieDTO], error)
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

	endpoint, err := r.getEndpoint("/discover/movie")
	if err != nil {
		return movies, err
	}

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
	q.Set("without_genres", "27,10749,10751,99,10769")
	q.Set("vote_count.gte", "50")
	q.Set("vote_average.gte", "3.0")

	u.RawQuery = q.Encode()

	response, err := r.fetch("GET", u.String(), nil)
	if err != nil {
		return movies, err
	}
	defer response.Body.Close()

	err = utils.GetBodyJSON(response, &movies)
	if err != nil {
		return movies, fmt.Errorf("failed to decode movie data: %w", err)
	}

	filteredResults := r.filterInappropriateMovies(movies.Results)
	movies.Results = filteredResults
	movies.TotalResults = len(filteredResults)

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

	if isAppropriate, reason := r.isMovieAppropriate(movie); !isAppropriate {
		return movie, fmt.Errorf("filme com %s não permitido", reason)
	}

	return movie, nil
}

func (r *TMDBRepository) SearchMovies(query string, page int) (dto.Pagination[dto.TMDBMovieDTO], error) {
	var err error
	var movies dto.Pagination[dto.TMDBMovieDTO]

	endpoint, err := r.getEndpoint("/search/movie")
	if err != nil {
		return movies, err
	}

	u, err := url.Parse(endpoint)
	if err != nil {
		return movies, err
	}

	q := u.Query()
	q.Set("query", query)
	q.Set("page", fmt.Sprintf("%d", page))
	q.Set("include_adult", "false")
	q.Set("language", "pt-BR")
	q.Set("region", "BR")
	q.Set("certification_country", "BR")
	q.Set("certification.lte", "12")
	q.Set("with_release_type", "2|3")
	q.Set("without_genres", "27,10749,10751,99,10769")
	q.Set("vote_count.gte", "10")
	q.Set("vote_average.gte", "3.0")

	u.RawQuery = q.Encode()

	response, err := r.fetch("GET", u.String(), nil)
	if err != nil {
		return movies, err
	}
	defer response.Body.Close()

	err = utils.GetBodyJSON(response, &movies)
	if err != nil {
		return movies, fmt.Errorf("failed to decode search results: %w", err)
	}

	filteredResults := r.filterInappropriateMovies(movies.Results)
	movies.Results = filteredResults
	movies.TotalResults = len(filteredResults)

	return movies, nil
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

// Função utilitária para verificar se um filme é adequado
func (r *TMDBRepository) isMovieAppropriate(movie dto.TMDBMovieDTO) (bool, string) {
	if movie.Adult {
		return false, "filme com conteúdo adulto"
	}

	inappropriateKeywords := []string{
		"porn", "xxx", "adult", "sex", "nude", "erotic", "pornographic", "explicit",
		"hardcore", "softcore", "adult film", "adult movie", "sex film", "sex movie",
		"nude film", "nude movie", "erotic film", "erotic movie", "porn film", "porn movie",
		"xxx film", "xxx movie", "adult content", "adult entertainment", "adult video",
		"sex video", "nude video", "erotic video", "porn video", "xxx video",
		"hardcore porn", "softcore porn", "adult porn", "sex porn", "nude porn",
		"erotic porn", "adult xxx", "sex xxx", "nude xxx", "erotic xxx",
		"adult sex", "nude sex", "erotic sex", "porn sex", "xxx sex",
		"adult nude", "sex nude", "erotic nude", "porn nude", "xxx nude",
		"adult erotic", "sex erotic", "nude erotic", "porn erotic", "xxx erotic",
	}

	titleLower := strings.ToLower(movie.Title)
	originalTitleLower := strings.ToLower(movie.OriginalTitle)

	for _, keyword := range inappropriateKeywords {
		if strings.Contains(titleLower, keyword) || strings.Contains(originalTitleLower, keyword) {
			return false, "filme com palavra-chave inadequada"
		}
	}

	if movie.VoteAverage > 0 && movie.VoteCount > 0 {
		if movie.VoteCount > 100 && movie.VoteAverage < 3.0 {
			return false, "filme com baixa avaliação"
		}
	}

	return true, ""
}

// Função utilitária para filtrar uma lista de filmes
func (r *TMDBRepository) filterInappropriateMovies(movies []dto.TMDBMovieDTO) []dto.TMDBMovieDTO {
	var filteredResults []dto.TMDBMovieDTO

	for _, movie := range movies {
		if isAppropriate, _ := r.isMovieAppropriate(movie); isAppropriate {
			filteredResults = append(filteredResults, movie)
		}
	}

	return filteredResults
}

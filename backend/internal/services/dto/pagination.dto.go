package dto

type Pagination[T any] struct {
	Results      []T `json:"results"`
	Page         int `json:"page"`
	TotalPages   int `json:"total_pages"`
	TotalResults int `json:"total_results"`
}

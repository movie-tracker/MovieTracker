package dto

// AuthResponseDTO represents the authentication response
type AuthResponseDTO struct {
	AuthToken string `json:"authToken" example:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."`
}

// ErrorResponseDTO represents an error response
type ErrorResponseDTO struct {
	Message    string `json:"message" example:"error.generic.bad_request"`
	StatusCode int    `json:"status_code" example:"400"`
}

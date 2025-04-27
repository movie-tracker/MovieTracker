package utils

import (
	"net/http"
)

func PanicOnError(err error) {
	if err != nil {
		panic(err)
	}
}

type IApiError interface {
	Error() string
	BuildError() (int, any)
}

type ApiError struct {
	Message string `json:"message"`
	Code    int    `json:"status_code"`
}

func (e *ApiError) Error() string {
	return e.Message
}

func (e *ApiError) BuildError() (int, any) {
	return e.Code, e
}

type InternalServerError struct {
	ApiError
	Err error `json:"-"`
}

func NewInternalServerError(err error) *InternalServerError {
	return &InternalServerError{
		ApiError: ApiError{
			Message: "error.internal_server_error",
			Code:    http.StatusInternalServerError,
		},
		Err: err,
	}
}

func NewNotFoundError(message string) *ApiError {
	return &ApiError{
		Message: FallbackZero(message, "error.not_found"),
		Code:    http.StatusNotFound,
	}
}

func NewBadRequestError(message string) *ApiError {
	return &ApiError{
		Message: FallbackZero(message, "error.bad_request"),
		Code:    http.StatusBadRequest,
	}
}

func NewUnauthorizedError(message string) *ApiError {
	return &ApiError{
		Message: FallbackZero(message, "error.unauthorized"),
		Code:    http.StatusUnauthorized,
	}
}

package utils

import (
	"errors"
	"fmt"
	"net/http"

	"github.com/go-playground/validator/v10"
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

type ValidationError struct {
	*ApiError
	Fields map[string]string `json:"fields"`
}

func (e *ValidationError) BuildError() (int, any) {
	return e.ApiError.Code, e
}

func NewValidationError(message string, err error) *ValidationError {
	var fields = map[string]string{}
	var verr validator.ValidationErrors

	if errors.As(err, &verr) {
		for _, f := range verr {
			fmt.Println(f.Field(), f.Tag())
			fields[f.Field()] = f.Tag()
		}
	} else {
		fmt.Println("Not a validation error")
	}

	return &ValidationError{
		ApiError: &ApiError{
			Message: FallbackZero(message, "error.validation"),
			Code:    http.StatusBadRequest,
		},
		Fields: fields,
	}
}

package utils

import (
	"encoding/json"
	"fmt"
	"net/http"
)

func GetBodyJSON[T any](response *http.Response, body *T) error {
	if response.StatusCode != http.StatusOK {
		return fmt.Errorf("failed request: %s", response.Status)
	}

	if err := json.NewDecoder(response.Body).Decode(body); err != nil {
		return fmt.Errorf("failed to decode response body: %w", err)
	}
	return nil
}

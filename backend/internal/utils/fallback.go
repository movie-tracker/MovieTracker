package utils

func Fallback[T any](value *T, fallback T) T {
	if value == nil {
		return fallback
	}
	return *value
}

func FallbackZero[T comparable](value T, fallback T) T {
	var zero T

	if value == zero {
		return fallback
	}

	return value
}

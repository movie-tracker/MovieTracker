package utils

import (
	"log/slog"
	"reflect"
	"strings"

	"github.com/gin-gonic/gin/binding"
	"github.com/go-playground/validator/v10"
)

func RegisterValidations() {
	if v, ok := binding.Validator.Engine().(*validator.Validate); ok {
		// Register custom validation tag name function. Get field name from struct tag "json" or "form" instead of the actual struct field name.
		v.RegisterTagNameFunc(func(fld reflect.StructField) string {
			formTag := strings.SplitN(fld.Tag.Get("form"), ",", 2)[0]
			jsonTag := strings.SplitN(fld.Tag.Get("json"), ",", 2)[0]
			name := FallbackZero(jsonTag, formTag)
			if name == "-" {
				return ""
			}
			return name
		})
	} else {
		slog.Warn("Could not register custom validation tag name function")
	}
}

package modules

import (
	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v5"
)

type RequestValidator struct {
	validator *validator.Validate
}

func NewRequestValidator() *RequestValidator {
	return &RequestValidator{
		validator: validator.New(),
	}
}

func (v *RequestValidator) Validate(input any) error {
	if err := v.validator.Struct(input); err != nil {
		return echo.ErrBadRequest.Wrap(err)
	}

	return nil
}

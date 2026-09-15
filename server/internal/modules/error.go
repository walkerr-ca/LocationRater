package modules

import (
	"errors"
	"net/http"

	"github.com/labstack/echo/v5"
)

func ErrorHandler(c *echo.Context, e error) {
	response, err := echo.UnwrapResponse(c.Response())
	if err == nil {
		if response.Committed {
			return
		}
	}

	status := http.StatusInternalServerError
	var statusCoder echo.HTTPStatusCoder
	if errors.As(e, &statusCoder) {
		if tempCode := statusCoder.StatusCode(); tempCode != 0 {
			status = tempCode
		}
	}

	message := e.Error()
	err = c.JSON(status, map[string]any{
		"success": false,
		"error":   message,
	})

	if err != nil {
		c.Logger().Error("failed to send error message", "error", err)
	}
}

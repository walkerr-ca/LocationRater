package controllers

import (
	"context"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v5"

	"github.com/walkerr-ca/LocationRater/server/internal/modules"
	"github.com/walkerr-ca/LocationRater/server/internal/services/database"
)

type UsersController struct {
	Queries *database.Queries
}

func NewUsersController(db *database.Queries) *UsersController {
	return &UsersController{
		Queries: db,
	}
}

func (controller *UsersController) RegisterRoutes(e *echo.Echo) {
	e.GET("/users/context", controller.GetUserContext)
	e.GET("/users/:id", controller.GetUser)
}

func (controller *UsersController) GetUserContext(c *echo.Context) error {
	user, err := modules.Authorize(c, controller.Queries)
	if err != nil {
		return echo.ErrUnauthorized.Wrap(err)
	}

	return c.JSON(http.StatusOK, map[string]any{
		"success": true,
		"result":  user,
	})
}

func (controller *UsersController) GetUser(c *echo.Context) error {
	_, err := modules.Authorize(c, controller.Queries)
	if err != nil {
		return echo.ErrUnauthorized.Wrap(err)
	}

	id64, err := strconv.ParseInt(c.Param("id"), 10, 32)
	if err != nil {
		return echo.ErrBadRequest.Wrap(err)
	}

	id := int32(id64)
	ctx := context.Background()
	user, err := controller.Queries.SelectUserById(ctx, id)
	if err != nil {
		return echo.ErrNotFound.Wrap(err)
	}

	return c.JSON(http.StatusOK, map[string]any{
		"success": true,
		"result":  user,
	})
}

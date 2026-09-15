package internal

import (
	"net/http"

	"github.com/labstack/echo/v5"
	"github.com/labstack/echo/v5/middleware"

	"github.com/walkerr-ca/LocationRater/server/internal/controllers"
	"github.com/walkerr-ca/LocationRater/server/internal/modules"
	"github.com/walkerr-ca/LocationRater/server/internal/types"
)

func Start(app *types.App) {
	e := echo.New()
	e.Logger = app.Logger
	e.Validator = modules.NewRequestValidator()
	e.HTTPErrorHandler = modules.ErrorHandler

	e.Use(middleware.RequestID())
	e.Use(middleware.RateLimiter(middleware.NewRateLimiterMemoryStore(20.0)))
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{http.MethodGet, http.MethodHead, http.MethodPut, http.MethodPatch, http.MethodPost, http.MethodDelete, http.MethodOptions},
	}))
	/*e.Use(middleware.RequestLoggerWithConfig(middleware.RequestLoggerConfig{
	LogMethod: true,
	LogStatus: true,
	LogURI:    true,
	}))*/

	usersController := controllers.NewUsersController(app.Database)
	usersController.RegisterRoutes(e)

	authController := controllers.NewAuthController(app.Database)
	authController.RegisterRoutes(e)

	reviewsController := controllers.NewReviewsController(app.Database)
	reviewsController.RegisterRoutes(e)

	if err := e.Start(":8080"); err != nil {
		e.Logger.Error("failed to start Echo server", "error", err)
	}
}

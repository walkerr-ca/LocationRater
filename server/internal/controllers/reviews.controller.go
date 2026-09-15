package controllers

import (
	"context"
	"net/http"

	"github.com/jackc/pgx/v5/pgtype"
	"github.com/labstack/echo/v5"

	"github.com/walkerr-ca/LocationRater/server/internal/modules"
	"github.com/walkerr-ca/LocationRater/server/internal/services/database"
	"github.com/walkerr-ca/LocationRater/server/internal/validators"
)

type ReviewsController struct {
	Queries *database.Queries
}

func NewReviewsController(db *database.Queries) *ReviewsController {
	return &ReviewsController{
		Queries: db,
	}
}

func (controller *ReviewsController) RegisterRoutes(e *echo.Echo) {
	e.GET("/reviews", controller.GetReviews)
	e.POST("/reviews", controller.SubmitReview)
}

func (controller *ReviewsController) GetReviews(c *echo.Context) error {
	_, err := modules.Authorize(c, controller.Queries)
	if err != nil {
		return echo.ErrUnauthorized.Wrap(err)
	}

	ctx := context.Background()
	reviews, err := controller.Queries.SelectReviews(ctx)
	if err != nil {
		return echo.ErrInternalServerError.Wrap(err)
	}

	return c.JSON(http.StatusOK, map[string]any{
		"success": true,
		"result":  reviews,
	})
}

func (controller *ReviewsController) SubmitReview(c *echo.Context) error {
	user, err := modules.Authorize(c, controller.Queries)
	if err != nil {
		return echo.ErrUnauthorized.Wrap(err)
	}

	request := new(validators.CreateReviewRequest)
	if err := c.Bind(request); err != nil {
		return echo.ErrBadRequest.Wrap(err)
	}

	if err := c.Validate(request); err != nil {
		return echo.ErrBadRequest.Wrap(err)
	}

	ctx := context.Background()
	location, err := controller.Queries.CreateLocation(ctx, database.CreateLocationParams{
		Name:      user.Username + "'s Location",
		Longitude: request.Longitude,
		Latitude:  request.Latitude,
	})

	if err != nil {
		return echo.ErrInternalServerError.Wrap(err)
	}

	review, err := controller.Queries.CreateReview(ctx, database.CreateReviewParams{
		UserID:      user.ID,
		LocationID:  location.ID,
		Title:       pgtype.Text{String: request.Title, Valid: true},
		Description: pgtype.Text{String: request.Description, Valid: true},
		Rating:      request.Rating,
	})

	if err != nil {
		return echo.ErrInternalServerError.Wrap(err)
	}

	return c.JSON(http.StatusOK, map[string]any{
		"success": true,
		"result":  review,
	})
}

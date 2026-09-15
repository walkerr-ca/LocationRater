package controllers

import (
	"context"
	"errors"
	"net/http"
	"time"

	"github.com/jackc/pgx/v5/pgtype"
	"github.com/labstack/echo/v5"

	"github.com/walkerr-ca/LocationRater/server/internal/modules"
	"github.com/walkerr-ca/LocationRater/server/internal/services/database"
	"github.com/walkerr-ca/LocationRater/server/internal/validators"
)

type AuthController struct {
	Queries *database.Queries
}

func NewAuthController(db *database.Queries) *AuthController {
	return &AuthController{
		Queries: db,
	}
}

func (controller *AuthController) RegisterRoutes(e *echo.Echo) {
	e.POST("/auth/login", controller.Login)
	e.POST("/auth/register", controller.Register)
	e.POST("/auth/refresh", controller.Refresh)
}

func (controller *AuthController) Login(c *echo.Context) error {
	request := new(validators.LoginRequest)
	if err := c.Bind(request); err != nil {
		return err
	}

	if err := c.Validate(request); err != nil {
		return err
	}

	ctx := context.Background()
	user, err := controller.Queries.SelectUserByUsername(ctx, request.Username)
	if err != nil {
		return echo.ErrNotFound.Wrap(err)
	}

	matchError := modules.CheckPassword(user.Password, request.Password)
	if matchError != nil {
		return echo.ErrUnauthorized.Wrap(matchError)
	}

	claims := &modules.Token{
		Username:  user.Username,
		CreatedAt: user.CreatedAt.Time.String(),
		ExpiresAt: modules.GetTokenExpiration(),
		Issuer:    modules.AuthorizationIssuer,
	}

	token, err := modules.GenerateTokenString(claims)
	if err != nil {
		return echo.ErrInternalServerError.Wrap(err)
	}

	refreshTokenValue, err := modules.RandomString(32)
	if err != nil {
		return echo.ErrInternalServerError.Wrap(err)
	}

	refreshTokenHash, err := modules.HashPassword(refreshTokenValue)
	if err != nil {
		return echo.ErrInternalServerError.Wrap(err)
	}

	sessionExpiration := modules.GetRefreshTokenExpiration(time.Now())
	session, err := controller.Queries.CreateSession(ctx, database.CreateSessionParams{
		UserID:       user.ID,
		RefreshToken: refreshTokenHash,
		DeletedAt:    pgtype.Timestamp{Time: sessionExpiration.Time},
	})

	if err != nil {
		return echo.ErrInternalServerError.Wrap(err)
	}

	refreshClaims := &modules.RefreshToken{
		SessionId: session.ID,
		Token:     refreshTokenValue,
		Issuer:    modules.AuthorizationIssuer,
		ExpiresAt: sessionExpiration,
	}

	refreshToken, err := modules.GenerateRefreshTokenString(refreshClaims)
	if err != nil {
		return echo.ErrInternalServerError.Wrap(err)
	}

	return c.JSON(http.StatusOK, map[string]any{
		"success": true,
		"result": map[string]any{
			"token":        token,
			"refreshToken": refreshToken,
		},
	})
}

func (controller *AuthController) Register(c *echo.Context) error {
	request := new(validators.RegisterRequest)
	if err := c.Bind(request); err != nil {
		return echo.ErrBadRequest.Wrap(err)
	}

	if err := c.Validate(request); err != nil {
		return echo.ErrBadRequest.Wrap(err)
	}

	hashedPassword, err := modules.HashPassword(request.Password)
	if err != nil {
		return echo.ErrInternalServerError.Wrap(err)
	}

	ctx := context.Background()
	existingUser, err := controller.Queries.SelectUserByUsername(ctx, request.Username)
	if err != nil || existingUser.ID != 0 {
		return echo.ErrBadRequest.Wrap(errors.New("username already exists"))
	}

	user, err := controller.Queries.CreateUser(ctx, database.CreateUserParams{
		Username: request.Username,
		Password: hashedPassword,
	})
	if err != nil {
		return echo.ErrInternalServerError.Wrap(err)
	}

	return c.JSON(http.StatusOK, map[string]any{
		"success": true,
		"result":  user,
	})
}

func (controller *AuthController) Refresh(c *echo.Context) error {
	request := new(validators.RefreshRequest)
	if err := c.Bind(request); err != nil {
		return echo.ErrBadRequest.Wrap(err)
	}

	if err := c.Validate(request); err != nil {
		return echo.ErrBadRequest.Wrap(err)
	}

	claims, err := modules.ParseRefreshToken(request.RefreshToken)
	if err != nil {
		return echo.ErrUnauthorized.Wrap(err)
	}

	ctx := context.Background()
	session, err := controller.Queries.SelectSessionById(ctx, claims.SessionId)
	if err != nil {
		return echo.ErrUnauthorized.Wrap(err)
	}

	hashedRefreshToken, err := modules.HashPassword(request.RefreshToken)
	if err != nil {
		return echo.ErrInternalServerError.Wrap(err)
	}

	if session.RefreshToken != hashedRefreshToken {
		return echo.ErrUnauthorized.Wrap(errors.New("invalid refresh token"))
	}

	user, err := controller.Queries.SelectUserById(ctx, session.UserID)
	if err != nil {
		return echo.ErrInternalServerError.Wrap(err)
	}

	refreshTokenValue, err := modules.RandomString(32)
	if err != nil {
		return echo.ErrInternalServerError.Wrap(err)
	}

	refreshTokenHash, err := modules.HashPassword(refreshTokenValue)
	if err != nil {
		return echo.ErrInternalServerError.Wrap(err)
	}

	if _, err := controller.Queries.UpdateSession(ctx, database.UpdateSessionParams{
		ID:           session.ID,
		RefreshToken: refreshTokenHash,
	}); err != nil {
		return echo.ErrInternalServerError.Wrap(err)
	}

	claims.ExpiresAt = modules.GetRefreshTokenExpiration(session.DeletedAt.Time)
	newRefreshToken, err := modules.GenerateRefreshTokenString(claims)
	if err != nil {
		return echo.ErrInternalServerError.Wrap(err)
	}

	tokenClaims := &modules.Token{
		Username:  user.Username,
		CreatedAt: user.CreatedAt.Time.String(),
		Issuer:    modules.AuthorizationIssuer,
		ExpiresAt: modules.GetTokenExpiration(),
	}

	token, err := modules.GenerateTokenString(tokenClaims)
	if err != nil {
		return echo.ErrInternalServerError.Wrap(err)
	}

	return c.JSON(http.StatusOK, map[string]any{
		"success": true,
		"result": map[string]any{
			"token":        token,
			"refreshToken": newRefreshToken,
		},
	})
}

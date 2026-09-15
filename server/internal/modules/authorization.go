package modules

import (
	"context"
	"os"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v5"
	"github.com/walkerr-ca/LocationRater/server/internal/services/database"
)

type Token struct {
	Username  string `json:"username"`
	CreatedAt string `json:"createdAt"`
	jwt.RegisteredClaims
}

type RefreshToken struct {
	SessionId int32  `json:"sessionId"`
	Token     string `json:"token"`
	jwt.RegisteredClaims
}

var AuthorizationSecret string = os.Getenv("JWT_SECRET")
var AuthorizationIssuer string = "LocationRater"

func GetTokenExpiration() *jwt.NumericDate {
	return jwt.NewNumericDate(time.Now().Add(time.Minute * 60))
}

func GetRefreshTokenExpiration(issuedAt time.Time) *jwt.NumericDate {
	return jwt.NewNumericDate(issuedAt.Add(time.Hour * 24 * 7))
}

func GenerateTokenString(claims *Token) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signedToken, err := token.SignedString([]byte(AuthorizationSecret))
	if err != nil {
		return "", err
	}

	return signedToken, nil
}

func GenerateRefreshTokenString(claims *RefreshToken) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signedToken, err := token.SignedString([]byte(AuthorizationSecret))
	if err != nil {
		return "", err
	}

	return signedToken, nil
}

func ParseToken(authorization string) (*Token, error) {
	claims := &Token{}
	_, err := jwt.ParseWithClaims(
		authorization,
		claims,
		func(t *jwt.Token) (any, error) {
			return []byte(AuthorizationSecret), nil
		},
		jwt.WithValidMethods([]string{jwt.SigningMethodHS256.Alg()}),
		jwt.WithIssuer(AuthorizationIssuer),
		jwt.WithExpirationRequired(),
	)

	if err != nil {
		return nil, err
	}

	return claims, nil
}

func ParseRefreshToken(refreshToken string) (*RefreshToken, error) {
	refreshClaims := &RefreshToken{}
	_, err := jwt.ParseWithClaims(
		refreshToken,
		refreshClaims,
		func(t *jwt.Token) (any, error) {
			return AuthorizationSecret, nil
		},
		jwt.WithValidMethods([]string{jwt.SigningMethodHS256.Alg()}),
		jwt.WithIssuer(AuthorizationIssuer),
		jwt.WithExpirationRequired(),
	)

	if err != nil {
		return nil, err
	}

	return refreshClaims, nil
}

func Authorize(c *echo.Context, queries *database.Queries) (*database.User, error) {
	request := c.Request()
	authorization := request.Header.Get("Authorization")
	if authorization == "" {
		return nil, echo.ErrUnauthorized
	}

	token := strings.ReplaceAll(authorization, "Bearer ", "")
	claims, err := ParseToken(token)
	if err != nil {
		return nil, err
	}

	ctx := context.Background()
	user, err := queries.SelectUserByUsername(ctx, claims.Username)
	if err != nil {
		return nil, err
	}

	return &user, nil
}

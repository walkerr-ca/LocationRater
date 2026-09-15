package types

import (
	"log/slog"

	"github.com/walkerr-ca/LocationRater/server/internal/services/database"
)

type App struct {
	Logger   *slog.Logger
	Database *database.Queries
}

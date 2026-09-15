package main

import (
	"context"
	"log/slog"
	"os"

	"github.com/jackc/pgx/v5"
	"github.com/joho/godotenv"

	"github.com/walkerr-ca/LocationRater/server/internal"
	"github.com/walkerr-ca/LocationRater/server/internal/services/database"
	"github.com/walkerr-ca/LocationRater/server/internal/types"
)

func main() {
	logger := slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{
		Level: slog.LevelInfo,
		// AddSource: true,
	}))

	if os.Getenv("DATABASE_URL") == "" {
		err := godotenv.Load()
		if err != nil {
			logger.Error("failed to load environment variables", "error", err)
			os.Exit(1)
		}
	}

	databaseUrl := os.Getenv("DATABASE_URL")
	logger.Info("databaseUrl", "databaseUrl", databaseUrl)
	connection, err := pgx.Connect(context.Background(), databaseUrl)
	if err != nil {
		logger.Error("failed to connect to the database", "error", err)
		os.Exit(1)
	}

	defer connection.Close(context.Background())

	queries := database.New(connection)

	app := &types.App{
		Logger:   logger,
		Database: queries,
	}

	internal.Start(app)
}

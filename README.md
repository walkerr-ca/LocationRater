# LocationRater

A simple location-based rating application built with Ionic and Go.

## Dependencies

- [Go](https://go.dev)
- [NPM/Node.JS](https://npmjs.com)
- [SQLC](https://sqlc.dev)
- [DBMate](https://github.com/amacneil/dbmate)
- [Air](https://github.com/air-verse/air)
- [Docker](https://docker.com)

## Database Setup

To get a local PostgreSQL database running, use Docker compose to spin up a container.

### Running

Run the container detached from the terminal session:
`docker compose up -d`

### Stopping

Shut down the container:
`docker compose down`

### Clear Data

Shut down the container and delete any persistent data:
`docker compose down -v`

## Environment Variables

Create a `.env` file with the following configuration:

```
###> Local Environment
DBMATE_MIGRATIONS_DIR="./server/sql/migrations"
DBMATE_SCHEMA_FILE="./server/sql/schema.sql"

###> Data Persistence
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/lr"
```

### Frontend Environment

When running the application outside of the local development environment, update the `apiUrl` variable in `./src/hooks/config.ts` to use the provided API URL.

## Getting Started

Follow the below steps to get the application up-and-running!

1. Download all dependencies
2. Create a local Postgres database, as shown above
3. Create a `.env` file with the above content
4. Run `dbmate migrate` to apply the migration(s) to your database
5. Run `air` to run the Go server
6. Run `ionic serve` to run the frontend in the browser

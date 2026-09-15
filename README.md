# LocationRater

A simple location-based rating application built with Ionic and Go.

## Dependencies

- [Go](https://go.dev)
- [PNPM/Node.JS](https://pnpm.io)
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

```
###> Local Environment
DBMATE_MIGRATIONS_DIR="./server/sql/migrations"
DBMATE_SCHEMA_FILE="./server/sql/schema.sql"

###> Data Persistence
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/lr"
```

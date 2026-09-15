-- name: SelectLocationById :one
select
  *
from
  location
where
  id = sqlc.arg ('id')
  and deleted_at is null;

-- name: SelectLocations :many
select
  *
from
  location
where
  deleted_at is null
order by
  created_at desc
limit
  sqlc.arg ('limit')
offset
  sqlc.arg ('offset');

-- name: SelectLocationsByRadius :many
select
  *
from
  location
where
  deleted_at is null
order by
  created_at desc
limit
  sqlc.arg ('limit')
offset
  sqlc.arg ('offset');

-- name: CreateLocation :one
insert into
  location (
    name,
    street_address,
    apartment,
    city,
    state,
    zip,
    country
  )
values
  (
    sqlc.arg ('name'),
    sqlc.arg ('street_address'),
    sqlc.arg ('apartment'),
    sqlc.arg ('city'),
    sqlc.arg ('state'),
    sqlc.arg ('zip'),
    sqlc.arg ('country')
  )
returning
  *;

-- name: DeleteLocation :exec
update location
set
  deleted_at = now()
where
  id = sqlc.arg ('id');

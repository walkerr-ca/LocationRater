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
  created_at desc;

-- name: SelectLocationsByDistance :many
select
  id,
  name,
  longitude,
  latitude,
  created_at,
  deleted_at,
  SQRT(
    POW (longitude - sqlc.arg ('longitude'), 2) + POW (latitude - sqlc.arg ('latitude'), 2)
  ) as distance
from
  location
where
  deleted_at is null
order by
  distance asc;

-- name: CreateLocation :one
insert into
  location (name, longitude, latitude)
values
  (
    sqlc.arg ('name'),
    sqlc.arg ('longitude'),
    sqlc.arg ('latitude')
  )
returning
  *;

-- name: DeleteLocation :exec
update location
set
  deleted_at = now()
where
  id = sqlc.arg ('id');

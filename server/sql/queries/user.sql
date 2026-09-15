-- name: SelectUserByUsername :one
select
  *
from
  "user"
where
  username = sqlc.arg ('username')
  and deleted_at is null;

-- name: SelectSessionById :one
select
  *
from
  session
where
  id = sqlc.arg ('id')
  and deleted_at > now();

-- name: SelectUserById :one
select
  *
from
  "user"
where
  id = sqlc.arg ('id')
  and deleted_at is null;

-- name: CreateUser :one
insert into
  "user" (username, password)
values
  (sqlc.arg ('username'), sqlc.arg ('password'))
returning
  *;

-- name: UpdateUser :one
update "user"
set
  password = sqlc.arg ('password')
where
  id = sqlc.arg ('id')
  and deleted_at is null
returning
  *;

-- name: DeleteUser :exec
update "user"
set
  deleted_at = now()
where
  id = sqlc.arg ('id')
  and deleted_at is null;

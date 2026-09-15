-- name: CreateSession :one
insert into
  session (user_id, refresh_token, deleted_at)
values
  (
    sqlc.arg ('user_id'),
    sqlc.arg ('refresh_token'),
    sqlc.arg ('deleted_at')
  )
returning
  *;

-- name: UpdateSession :one
update session
set
  refresh_token = sqlc.arg ('refresh_token'),
  updated_at = now()
where
  id = sqlc.arg ('id')
  and deleted_at > now()
returning
  *;

-- name: DeleteSession :exec
update session
set
  deleted_at = now()
where
  id = sqlc.arg ('id')
  and deleted_at > now();

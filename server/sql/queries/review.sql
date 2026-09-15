-- name: SelectReview :one
select
  *
from
  review
where
  id = sqlc.arg ('id')
  and deleted_at is null;

-- name: SelectReviews :many
select
  *
from
  review
where
  deleted_at is null
order by
  created_at desc;

-- name: SelectReviewsByLocation :many
select
  *
from
  review
where
  location_id = sqlc.arg ('location_id')
  and deleted_at is null
order by
  created_at desc;

-- name: SelectReviewsByUser :many
select
  *
from
  review
where
  user_id = sqlc.arg ('user_id')
  and deleted_at is null
order by
  created_at desc;

-- name: CreateReview :one
insert into
  review (user_id, location_id, title, description, rating)
values
  (
    sqlc.arg ('user_id'),
    sqlc.arg ('location_id'),
    sqlc.arg ('title'),
    sqlc.arg ('description'),
    sqlc.arg ('rating')
  )
returning
  *;

-- name: UpdateReview :one
update review
set
  title = sqlc.arg ('title'),
  description = sqlc.arg ('description'),
  rating = sqlc.arg ('rating')
where
  id = sqlc.arg ('id')
  and deleted_at is null
returning
  *;

-- name: DeleteReview :exec
update review
set
  deleted_at = now()
where
  id = sqlc.arg ('id')
  and deleted_at is null;

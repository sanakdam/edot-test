-- name: CreateUser :one
insert into users
  (name, email, phone, type, password, updated_at)
values
  (@name, @email, @phone, @type, @password, now()) returning id;
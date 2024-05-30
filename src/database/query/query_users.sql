-- name: FindUser :one
select
  id, type, password
from public.users
where type = @type and (email = @username or phone = @username);

-- name: FindUserById :one
select
  id, name, phone, email, created_at
from public.users
where id = @id;
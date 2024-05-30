-- name: FindUser :one
select id, password from public.users where type = @type and (email = @username or phone = @username);
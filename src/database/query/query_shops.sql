-- name: FindShopByUserId :one
select
  s.id, s.name, s.status, u.name as pic_name, u.phone as pic_phone, u.email as pic_email, s.created_at
from public.shops s
inner join public.users u on u.id = s.user_id
where s.user_id = @user_id;

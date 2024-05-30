-- name: FindShopByUserId :one
select
  s.id, s.name, s.status, u.name as pic_name, u.phone as pic_phone, u.email as pic_email, s.created_at
from public.shops s
inner join public.users u on u.id = s.user_id
where s.user_id = @user_id;

-- name: FindProducts :many
select
  p.id, p.name, p.price, p.description, s.id as shop_id, s.name as shop_name, sum(ps.quantity) as quantity
from public.products p
inner join public.shops s on s.id = p.shop_id
inner join public.product_stocks ps on ps.product_id = p.id
inner join public.warehouses w on w.id = ps.warehouse_id
where p.status = 'ACTIVE' and w.status = 'ACTIVE'
group by p.id, p.price, p.name, p.description, s.id, s.name
limit @page_limit
offset @page_offset;

-- name: FindProductById :one
select
  p.id, p.name, p.price, p.description, s.id as shop_id, s.name as shop_name
from public.products p
inner join public.shops s on s.id = p.shop_id
where p.id = @id;

-- name: FindShopById :one
select
  s.id, s.name, s.status, u.name as pic_name, u.phone as pic_phone, u.email as pic_email, s.created_at
from public.shops s
inner join public.users u on u.id = s.user_id
where s.id = @id;
-- name: CreateShop :one
insert into shops
  (user_id, name, status, updated_at)
values
  (@user_id, @name, @status, now()) returning id;

-- name: CreateWarehouse :one
insert into warehouses
  (shop_id, status, name, location, updated_at)
values
  (@shop_id, @status, @name, @location, now()) returning id;

-- name: CreateProduct :one
insert into products
  (shop_id, name, price, status, description, updated_at)
values
  (@shop_id, @name, @price, @status, @description, now()) returning id;

-- name: CreateProductStock :one
insert into product_stocks
  (shop_id, product_id, warehouse_id, quantity, updated_at)
values
  (@shop_id, @product_id, @warehouse_id, @quantity, now()) returning id;

-- name: BookProductStock :one
with selected_stocks as (
  select
    ps.id, w.id as warehouse_id, w.name as warehouse_name, w.location as warehouse_location
  from product_stocks ps
  inner join warehouses w on w.id = ps.warehouse_id
  where ps.product_id = @id and w.status = 'ACTIVE' and ps.quantity >= @quantity
  limit 1 
)
update product_stocks
  set
    quantity = product_stocks.quantity - @quantity
from selected_stocks
where product_stocks.id = selected_stocks.id
returning selected_stocks.id, selected_stocks.warehouse_id, selected_stocks.warehouse_name, selected_stocks.warehouse_location;
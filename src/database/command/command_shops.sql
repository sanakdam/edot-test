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
  (shop_id, name, status, description, updated_at)
values
  (@shop_id, @name, @status, @description, now()) returning id;

-- name: CreateProductStock :one
insert into product_stocks
  (shop_id, product_id, warehouse_id, quantity, updated_at)
values
  (@shop_id, @product_id, @warehouse_id, @quantity, now()) returning id;
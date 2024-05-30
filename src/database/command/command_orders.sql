-- name: CreateSalesOrder :one
insert into sales_orders
  (user_id, amount, payment_metadata, updated_at)
values
  (@user_id, @amount, @payment_metadata, now()) returning id;

-- name: CreateOrder :one
insert into orders
  (sales_order_id, user_id, shop_id, amount, shipping_metadata, user_metadata, shop_metadata, updated_at)
values
  (@sales_order_id, @user_id, @shop_id, @amount, @shipping_metadata, @user_metadata, @shop_metadata, now()) returning id;

-- name: CreateOrderItem :one
insert into order_items
  (order_id, product_id, warehouse_id, quantity, price, product_metadata, warehouse_metadata, updated_at)
values
  (@order_id, @product_id, @warehouse_id, @quantity, @price, @product_metadata, @warehouse_metadata, now()) returning id;

-- name: UpdateSalesOrderAmount :one
update sales_orders
  set amount = @amount
where id = @id returning id;

-- name: UpdateOrderAmount :one
update orders
  set amount = @amount
where id = @id returning id;
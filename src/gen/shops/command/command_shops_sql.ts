import { QueryArrayConfig, QueryArrayResult } from "pg";

interface Client {
    query: (config: QueryArrayConfig) => Promise<QueryArrayResult>;
}

export const createShopQuery = `-- name: CreateShop :one
insert into shops
  (user_id, name, status, updated_at)
values
  ($1, $2, $3, now()) returning id`;

export interface CreateShopArgs {
    userId: string | null;
    name: string | null;
    status: string | null;
}

export interface CreateShopRow {
    id: string;
}

export async function createShop(client: Client, args: CreateShopArgs): Promise<CreateShopRow | null> {
    const result = await client.query({
        text: createShopQuery,
        values: [args.userId, args.name, args.status],
        rowMode: "array"
    });
    if (result.rows.length !== 1) {
        return null;
    }
    const row = result.rows[0];
    return {
        id: row[0]
    };
}

export const createWarehouseQuery = `-- name: CreateWarehouse :one
insert into warehouses
  (shop_id, status, name, location, updated_at)
values
  ($1, $2, $3, $4, now()) returning id`;

export interface CreateWarehouseArgs {
    shopId: string | null;
    status: string | null;
    name: string | null;
    location: string | null;
}

export interface CreateWarehouseRow {
    id: string;
}

export async function createWarehouse(client: Client, args: CreateWarehouseArgs): Promise<CreateWarehouseRow | null> {
    const result = await client.query({
        text: createWarehouseQuery,
        values: [args.shopId, args.status, args.name, args.location],
        rowMode: "array"
    });
    if (result.rows.length !== 1) {
        return null;
    }
    const row = result.rows[0];
    return {
        id: row[0]
    };
}

export const createProductQuery = `-- name: CreateProduct :one
insert into products
  (shop_id, name, price, status, description, updated_at)
values
  ($1, $2, $3, $4, $5, now()) returning id`;

export interface CreateProductArgs {
    shopId: string | null;
    name: string | null;
    price: string | null;
    status: string | null;
    description: string | null;
}

export interface CreateProductRow {
    id: string;
}

export async function createProduct(client: Client, args: CreateProductArgs): Promise<CreateProductRow | null> {
    const result = await client.query({
        text: createProductQuery,
        values: [args.shopId, args.name, args.price, args.status, args.description],
        rowMode: "array"
    });
    if (result.rows.length !== 1) {
        return null;
    }
    const row = result.rows[0];
    return {
        id: row[0]
    };
}

export const createProductStockQuery = `-- name: CreateProductStock :one
insert into product_stocks
  (shop_id, product_id, warehouse_id, quantity, updated_at)
values
  ($1, $2, $3, $4, now()) returning id`;

export interface CreateProductStockArgs {
    shopId: string | null;
    productId: string | null;
    warehouseId: string | null;
    quantity: string | null;
}

export interface CreateProductStockRow {
    id: string;
}

export async function createProductStock(client: Client, args: CreateProductStockArgs): Promise<CreateProductStockRow | null> {
    const result = await client.query({
        text: createProductStockQuery,
        values: [args.shopId, args.productId, args.warehouseId, args.quantity],
        rowMode: "array"
    });
    if (result.rows.length !== 1) {
        return null;
    }
    const row = result.rows[0];
    return {
        id: row[0]
    };
}

export const bookProductStockQuery = `-- name: BookProductStock :one
with selected_stocks as (
  select
    ps.id, w.id as warehouse_id, w.name as warehouse_name, w.location as warehouse_location
  from product_stocks ps
  inner join warehouses w on w.id = ps.warehouse_id
  where ps.product_id = $2 and w.status = 'ACTIVE' and ps.quantity >= $1
  limit 1 
)
update product_stocks
  set
    quantity = product_stocks.quantity - $1
from selected_stocks
where product_stocks.id = selected_stocks.id
returning selected_stocks.id, selected_stocks.warehouse_id, selected_stocks.warehouse_name, selected_stocks.warehouse_location`;

export interface BookProductStockArgs {
    quantity: string | null;
    id: string | null;
}

export interface BookProductStockRow {
    id: string;
    warehouseId: string;
    warehouseName: string | null;
    warehouseLocation: string | null;
}

export async function bookProductStock(client: Client, args: BookProductStockArgs): Promise<BookProductStockRow | null> {
    const result = await client.query({
        text: bookProductStockQuery,
        values: [args.quantity, args.id],
        rowMode: "array"
    });
    if (result.rows.length !== 1) {
        return null;
    }
    const row = result.rows[0];
    return {
        id: row[0],
        warehouseId: row[1],
        warehouseName: row[2],
        warehouseLocation: row[3]
    };
}


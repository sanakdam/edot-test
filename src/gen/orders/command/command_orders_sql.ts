import { QueryArrayConfig, QueryArrayResult } from "pg";

interface Client {
    query: (config: QueryArrayConfig) => Promise<QueryArrayResult>;
}

export const createSalesOrderQuery = `-- name: CreateSalesOrder :one
insert into sales_orders
  (user_id, amount, payment_metadata, updated_at)
values
  ($1, $2, $3, now()) returning id`;

export interface CreateSalesOrderArgs {
    userId: string | null;
    amount: string | null;
    paymentMetadata: any | null;
}

export interface CreateSalesOrderRow {
    id: string;
}

export async function createSalesOrder(client: Client, args: CreateSalesOrderArgs): Promise<CreateSalesOrderRow | null> {
    const result = await client.query({
        text: createSalesOrderQuery,
        values: [args.userId, args.amount, args.paymentMetadata],
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

export const createOrderQuery = `-- name: CreateOrder :one
insert into orders
  (sales_order_id, user_id, shop_id, amount, shipping_metadata, user_metadata, shop_metadata, updated_at)
values
  ($1, $2, $3, $4, $5, $6, $7, now()) returning id`;

export interface CreateOrderArgs {
    salesOrderId: string | null;
    userId: string | null;
    shopId: string | null;
    amount: string | null;
    shippingMetadata: any | null;
    userMetadata: any | null;
    shopMetadata: any | null;
}

export interface CreateOrderRow {
    id: string;
}

export async function createOrder(client: Client, args: CreateOrderArgs): Promise<CreateOrderRow | null> {
    const result = await client.query({
        text: createOrderQuery,
        values: [args.salesOrderId, args.userId, args.shopId, args.amount, args.shippingMetadata, args.userMetadata, args.shopMetadata],
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

export const createOrderItemQuery = `-- name: CreateOrderItem :one
insert into order_items
  (order_id, product_id, warehouse_id, quantity, price, product_metadata, warehouse_metadata, updated_at)
values
  ($1, $2, $3, $4, $5, $6, $7, now()) returning id`;

export interface CreateOrderItemArgs {
    orderId: string | null;
    productId: string | null;
    warehouseId: string | null;
    quantity: string | null;
    price: string | null;
    productMetadata: any | null;
    warehouseMetadata: any | null;
}

export interface CreateOrderItemRow {
    id: string;
}

export async function createOrderItem(client: Client, args: CreateOrderItemArgs): Promise<CreateOrderItemRow | null> {
    const result = await client.query({
        text: createOrderItemQuery,
        values: [args.orderId, args.productId, args.warehouseId, args.quantity, args.price, args.productMetadata, args.warehouseMetadata],
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

export const updateSalesOrderAmountQuery = `-- name: UpdateSalesOrderAmount :one
update sales_orders
  set amount = $1
where id = $2 returning id`;

export interface UpdateSalesOrderAmountArgs {
    amount: string | null;
    id: string;
}

export interface UpdateSalesOrderAmountRow {
    id: string;
}

export async function updateSalesOrderAmount(client: Client, args: UpdateSalesOrderAmountArgs): Promise<UpdateSalesOrderAmountRow | null> {
    const result = await client.query({
        text: updateSalesOrderAmountQuery,
        values: [args.amount, args.id],
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

export const updateOrderAmountQuery = `-- name: UpdateOrderAmount :one
update orders
  set amount = $1
where id = $2 returning id`;

export interface UpdateOrderAmountArgs {
    amount: string | null;
    id: string;
}

export interface UpdateOrderAmountRow {
    id: string;
}

export async function updateOrderAmount(client: Client, args: UpdateOrderAmountArgs): Promise<UpdateOrderAmountRow | null> {
    const result = await client.query({
        text: updateOrderAmountQuery,
        values: [args.amount, args.id],
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


import { QueryArrayConfig, QueryArrayResult } from "pg";

interface Client {
    query: (config: QueryArrayConfig) => Promise<QueryArrayResult>;
}

export const findShopByUserIdQuery = `-- name: FindShopByUserId :one
select
  s.id, s.name, s.status, u.name as pic_name, u.phone as pic_phone, u.email as pic_email, s.created_at
from public.shops s
inner join public.users u on u.id = s.user_id
where s.user_id = $1`;

export interface FindShopByUserIdArgs {
    userId: string | null;
}

export interface FindShopByUserIdRow {
    id: string;
    name: string | null;
    status: string | null;
    picName: string | null;
    picPhone: string | null;
    picEmail: string | null;
    createdAt: Date | null;
}

export async function findShopByUserId(client: Client, args: FindShopByUserIdArgs): Promise<FindShopByUserIdRow | null> {
    const result = await client.query({
        text: findShopByUserIdQuery,
        values: [args.userId],
        rowMode: "array"
    });
    if (result.rows.length !== 1) {
        return null;
    }
    const row = result.rows[0];
    return {
        id: row[0],
        name: row[1],
        status: row[2],
        picName: row[3],
        picPhone: row[4],
        picEmail: row[5],
        createdAt: row[6]
    };
}

export const findProductsQuery = `-- name: FindProducts :many
select
  p.id, p.name, p.price, p.description, s.id as shop_id, s.name as shop_name, sum(ps.quantity) as quantity
from public.products p
inner join public.shops s on s.id = p.shop_id
inner join public.product_stocks ps on ps.product_id = p.id
inner join public.warehouses w on w.id = ps.warehouse_id
where p.status = 'ACTIVE' and w.status = 'ACTIVE'
group by p.id, p.price, p.name, p.description, s.id, s.name
limit $2
offset $1`;

export interface FindProductsArgs {
    pageOffset: string;
    pageLimit: string;
}

export interface FindProductsRow {
    id: string;
    name: string | null;
    price: string | null;
    description: string | null;
    shopId: string;
    shopName: string | null;
    quantity: string;
}

export async function findProducts(client: Client, args: FindProductsArgs): Promise<FindProductsRow[]> {
    const result = await client.query({
        text: findProductsQuery,
        values: [args.pageOffset, args.pageLimit],
        rowMode: "array"
    });
    return result.rows.map(row => {
        return {
            id: row[0],
            name: row[1],
            price: row[2],
            description: row[3],
            shopId: row[4],
            shopName: row[5],
            quantity: row[6]
        };
    });
}

export const findProductByIdQuery = `-- name: FindProductById :one
select
  p.id, p.name, p.price, p.description, s.id as shop_id, s.name as shop_name
from public.products p
inner join public.shops s on s.id = p.shop_id
where p.id = $1`;

export interface FindProductByIdArgs {
    id: string;
}

export interface FindProductByIdRow {
    id: string;
    name: string | null;
    price: string | null;
    description: string | null;
    shopId: string;
    shopName: string | null;
}

export async function findProductById(client: Client, args: FindProductByIdArgs): Promise<FindProductByIdRow | null> {
    const result = await client.query({
        text: findProductByIdQuery,
        values: [args.id],
        rowMode: "array"
    });
    if (result.rows.length !== 1) {
        return null;
    }
    const row = result.rows[0];
    return {
        id: row[0],
        name: row[1],
        price: row[2],
        description: row[3],
        shopId: row[4],
        shopName: row[5]
    };
}

export const findShopByIdQuery = `-- name: FindShopById :one
select
  s.id, s.name, s.status, u.name as pic_name, u.phone as pic_phone, u.email as pic_email, s.created_at
from public.shops s
inner join public.users u on u.id = s.user_id
where s.id = $1`;

export interface FindShopByIdArgs {
    id: string;
}

export interface FindShopByIdRow {
    id: string;
    name: string | null;
    status: string | null;
    picName: string | null;
    picPhone: string | null;
    picEmail: string | null;
    createdAt: Date | null;
}

export async function findShopById(client: Client, args: FindShopByIdArgs): Promise<FindShopByIdRow | null> {
    const result = await client.query({
        text: findShopByIdQuery,
        values: [args.id],
        rowMode: "array"
    });
    if (result.rows.length !== 1) {
        return null;
    }
    const row = result.rows[0];
    return {
        id: row[0],
        name: row[1],
        status: row[2],
        picName: row[3],
        picPhone: row[4],
        picEmail: row[5],
        createdAt: row[6]
    };
}


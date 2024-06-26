import { QueryArrayConfig, QueryArrayResult } from "pg";

interface Client {
    query: (config: QueryArrayConfig) => Promise<QueryArrayResult>;
}

export const listOrderQuery = `-- name: ListOrder :many
select id, sales_order_id, user_id, shop_id, status, amount, shipping_metadata, user_metadata, shop_metadata, created_at, updated_at from public.orders`;

export interface ListOrderRow {
    id: string;
    salesOrderId: string | null;
    userId: string | null;
    shopId: string | null;
    status: string | null;
    amount: string | null;
    shippingMetadata: any | null;
    userMetadata: any | null;
    shopMetadata: any | null;
    createdAt: Date | null;
    updatedAt: Date | null;
}

export async function listOrder(client: Client): Promise<ListOrderRow[]> {
    const result = await client.query({
        text: listOrderQuery,
        values: [],
        rowMode: "array"
    });
    return result.rows.map(row => {
        return {
            id: row[0],
            salesOrderId: row[1],
            userId: row[2],
            shopId: row[3],
            status: row[4],
            amount: row[5],
            shippingMetadata: row[6],
            userMetadata: row[7],
            shopMetadata: row[8],
            createdAt: row[9],
            updatedAt: row[10]
        };
    });
}


import { QueryArrayConfig, QueryArrayResult } from "pg";

interface Client {
    query: (config: QueryArrayConfig) => Promise<QueryArrayResult>;
}

export const listShopQuery = `-- name: ListShop :many
select id, name, status, created_at, updated_at from public.shops`;

export interface ListShopRow {
    id: string;
    name: string | null;
    status: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
}

export async function listShop(client: Client): Promise<ListShopRow[]> {
    const result = await client.query({
        text: listShopQuery,
        values: [],
        rowMode: "array"
    });
    return result.rows.map(row => {
        return {
            id: row[0],
            name: row[1],
            status: row[2],
            createdAt: row[3],
            updatedAt: row[4]
        };
    });
}


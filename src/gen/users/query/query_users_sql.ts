import { QueryArrayConfig, QueryArrayResult } from "pg";

interface Client {
    query: (config: QueryArrayConfig) => Promise<QueryArrayResult>;
}

export const listUserQuery = `-- name: ListUser :many
select id, name, email, phone, type, password, created_at, updated_at from public.users`;

export interface ListUserRow {
    id: string;
    name: string | null;
    email: string | null;
    phone: string | null;
    type: string | null;
    password: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
}

export async function listUser(client: Client): Promise<ListUserRow[]> {
    const result = await client.query({
        text: listUserQuery,
        values: [],
        rowMode: "array"
    });
    return result.rows.map(row => {
        return {
            id: row[0],
            name: row[1],
            email: row[2],
            phone: row[3],
            type: row[4],
            password: row[5],
            createdAt: row[6],
            updatedAt: row[7]
        };
    });
}


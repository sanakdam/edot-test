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


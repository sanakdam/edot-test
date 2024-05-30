import { QueryArrayConfig, QueryArrayResult } from "pg";

interface Client {
    query: (config: QueryArrayConfig) => Promise<QueryArrayResult>;
}

export const findUserQuery = `-- name: FindUser :one
select id, password from public.users where type = $1 and (email = $2 or phone = $2)`;

export interface FindUserArgs {
    type: string | null;
    username: string | null;
}

export interface FindUserRow {
    id: string;
    password: string;
}

export async function findUser(client: Client, args: FindUserArgs): Promise<FindUserRow | null> {
    const result = await client.query({
        text: findUserQuery,
        values: [args.type, args.username],
        rowMode: "array"
    });
    if (result.rows.length !== 1) {
        return null;
    }
    const row = result.rows[0];
    return {
        id: row[0],
        password: row[1]
    };
}


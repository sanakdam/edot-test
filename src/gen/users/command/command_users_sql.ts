import { QueryArrayConfig, QueryArrayResult } from "pg";

interface Client {
    query: (config: QueryArrayConfig) => Promise<QueryArrayResult>;
}

export const createUserQuery = `-- name: CreateUser :one
insert into users
  (name, email, phone, type, password, updated_at)
values
  ($1, $2, $3, $4, $5, now()) returning id`;

export interface CreateUserArgs {
    name: string | null;
    email: string | null;
    phone: string | null;
    type: string;
    password: string;
}

export interface CreateUserRow {
    id: string;
}

export async function createUser(client: Client, args: CreateUserArgs): Promise<CreateUserRow | null> {
    const result = await client.query({
        text: createUserQuery,
        values: [args.name, args.email, args.phone, args.type, args.password],
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


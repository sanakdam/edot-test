import { QueryArrayConfig, QueryArrayResult } from "pg";

interface Client {
    query: (config: QueryArrayConfig) => Promise<QueryArrayResult>;
}

export const findUserQuery = `-- name: FindUser :one
select
  id, type, password
from public.users
where type = $1 and (email = $2 or phone = $2)`;

export interface FindUserArgs {
    type: string;
    username: string | null;
}

export interface FindUserRow {
    id: string;
    type: string;
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
        type: row[1],
        password: row[2]
    };
}

export const findUserByIdQuery = `-- name: FindUserById :one
select
  id, name, phone, email, created_at
from public.users
where id = $1`;

export interface FindUserByIdArgs {
    id: string;
}

export interface FindUserByIdRow {
    id: string;
    name: string | null;
    phone: string | null;
    email: string | null;
    createdAt: Date | null;
}

export async function findUserById(client: Client, args: FindUserByIdArgs): Promise<FindUserByIdRow | null> {
    const result = await client.query({
        text: findUserByIdQuery,
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
        phone: row[2],
        email: row[3],
        createdAt: row[4]
    };
}


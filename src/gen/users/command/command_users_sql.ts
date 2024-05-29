import { QueryArrayConfig, QueryArrayResult } from "pg";

interface Client {
    query: (config: QueryArrayConfig) => Promise<QueryArrayResult>;
}

export const registerUserQuery = `-- name: RegisterUser :exec
insert into
  users (name, email, phone, type, password, updated_at)
values
  ($1, $2, $3, $4, $5, now())`;

export interface RegisterUserArgs {
    name: string | null;
    email: string | null;
    phone: string | null;
    type: string | null;
    password: string | null;
}

export async function registerUser(client: Client, args: RegisterUserArgs): Promise<void> {
    await client.query({
        text: registerUserQuery,
        values: [args.name, args.email, args.phone, args.type, args.password],
        rowMode: "array"
    });
}


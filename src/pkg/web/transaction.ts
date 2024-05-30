import {Pool} from 'pg';

export async function transactionBegin(client: Pool) {
  await client.query('BEGIN');
}

export async function transactionCommit(client: Pool) {
  await client.query('COMMIT');
}

export async function transactionRollback(client: Pool) {
  await client.query('ROLLBACK');
}

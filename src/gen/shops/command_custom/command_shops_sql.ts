import {QueryArrayConfig, QueryArrayResult} from 'pg';
import format from 'pg-format';
import {
  CreateProductStockArgs,
  CreateProductStockRow,
  CreateWarehouseArgs,
  CreateWarehouseRow,
} from '@/gen/shops/command/command_shops_sql';

interface Client {
  query: (config: QueryArrayConfig) => Promise<QueryArrayResult>;
}

export const createWarehousesQuery = `-- name: CreateWarehouses :many
insert into warehouses
  (shop_id, status, name, location, updated_at)
values %L returning id`;

export async function createWarehouses(
  client: Client,
  args: Array<CreateWarehouseArgs>
): Promise<Array<CreateWarehouseRow>> {
  const values: Array<Array<number | string | null>> = [];

  for (const arg of args) {
    values.push([arg.shopId, arg.status, arg.name, arg.location, 'now()']);
  }

  const result = await client.query({
    text: format(createWarehousesQuery, values),
    values: [],
    rowMode: 'array',
  });

  return result.rows.map(row => {
    return {
      id: row[0],
    };
  });
}

export const createProductStocksQuery = `-- name: CreateProductStocks :many
insert into product_stocks
  (shop_id, product_id, warehouse_id, quantity, updated_at)
values %L returning id`;

export async function createProductStocks(
  client: Client,
  args: Array<CreateProductStockArgs>
): Promise<Array<CreateProductStockRow>> {
  const values: Array<Array<number | string | null>> = [];

  for (const arg of args) {
    values.push([arg.shopId, arg.productId, arg.warehouseId, arg.quantity, 'now()']);
  }

  const result = await client.query({
    text: format(createProductStocksQuery, values),
    values: [],
    rowMode: 'array',
  });

  return result.rows.map(row => {
    return {
      id: row[0],
    };
  });
}

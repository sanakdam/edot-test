import {CreateOrderItemArgs, CreateOrderItemRow} from '@/gen/orders/command/command_orders_sql';
import {QueryArrayConfig, QueryArrayResult} from 'pg';
import format from 'pg-format';

interface Client {
  query: (config: QueryArrayConfig) => Promise<QueryArrayResult>;
}

export const createOrderItemsQuery = `-- name: CreateOrderItems :many
insert into order_items
  (order_id, product_id, warehouse_id, quantity, price, product_metadata, warehouse_metadata, updated_at)
values %L returning id`;

export async function createOrderItems(
  client: Client,
  args: Array<CreateOrderItemArgs>
): Promise<Array<CreateOrderItemRow>> {
  const values: Array<Array<number | string | null>> = [];

  for (const arg of args) {
    values.push([arg.orderId, arg.productId, arg.warehouseId, arg.quantity, arg.price, arg.productMetadata, arg.warehouseMetadata, 'now()']);
  }

  const result = await client.query({
    text: format(createOrderItemsQuery, values),
    values: [],
    rowMode: 'array',
  });

  return result.rows.map(row => {
    return {
      id: row[0],
    };
  });
}

import {
  createProduct,
  CreateProductArgs,
  CreateProductRow,
  CreateProductStockArgs,
} from '@/gen/shops/command/command_shops_sql';
import {createProductStocks} from '@/gen/shops/command_custom/command_shops_sql';
import {
  findShopByUserId,
  FindShopByUserIdArgs,
} from '@/gen/shops/query/query_shops_sql';
import {parseError} from '@/pkg/helpers/error';
import {
  transactionBegin,
  transactionCommit,
  transactionRollback,
} from '@/pkg/web/transaction';
import {ShopUC} from './port';

export type SaveProductStockArgs = {
  warehouse_id: string;
  quantity: string;
};

export type SaveProductArgs = {
  user_id: string;
  name: string;
  description: string;
  product_stocks: Array<SaveProductStockArgs>;
};

export async function saveProduct(
  uc: ShopUC,
  args: SaveProductArgs
): Promise<CreateProductRow | Error> {
  try {
    await transactionBegin(uc.command);

    const shopArgs: FindShopByUserIdArgs = {
      userId: args.user_id,
    };
    const shopRow = await findShopByUserId(uc.command, shopArgs);
    if (shopRow === null) {
      await transactionRollback(uc.command);
      throw new Error('Shop not found!');
    }

    const productArgs: CreateProductArgs = {
      shopId: shopRow.id,
      name: args.name,
      status: 'ACTIVE',
      description: args.description,
    };
    const productRow = await createProduct(uc.query, productArgs);
    if (productRow === null) {
      await transactionRollback(uc.command);
      throw new Error('Failed to create product!');
    }

    const productStocksArgs: Array<CreateProductStockArgs> = [];
    for (const ps of args.product_stocks) {
      productStocksArgs.push({
        shopId: shopRow.id,
        productId: productRow.id,
        warehouseId: ps.warehouse_id,
        quantity: ps.quantity,
      });
    }

    const productStockRows = await createProductStocks(
      uc.command,
      productStocksArgs
    );
    if (productStockRows.length === 0) {
      await transactionRollback(uc.command);
      throw new Error('Failed to create product_stocks!');
    }

    await transactionCommit(uc.command);
    return productRow;
  } catch (err: unknown) {
    await transactionRollback(uc.command);
    throw parseError(err);
  }
}

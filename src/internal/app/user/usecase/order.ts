import {
  createOrder,
  CreateOrderArgs,
  CreateOrderItemArgs,
  createSalesOrder,
  CreateSalesOrderArgs,
  CreateSalesOrderRow,
  updateOrderAmount,
  UpdateOrderAmountArgs,
  updateSalesOrderAmount,
  UpdateSalesOrderAmountArgs,
} from '@/gen/orders/command/command_orders_sql';
import {createOrderItems} from '@/gen/orders/command_custom/command_orders_sql';
import {
  bookProductStock,
  BookProductStockArgs,
} from '@/gen/shops/command/command_shops_sql';
import {
  findProductById,
  FindProductByIdArgs,
  findShopById,
  FindShopByIdArgs,
} from '@/gen/shops/query/query_shops_sql';
import {
  findUserById,
  FindUserByIdArgs,
} from '@/gen/users/query/query_users_sql';
import {parseError} from '@/pkg/helpers/error';
import {
  transactionBegin,
  transactionCommit,
  transactionRollback,
} from '@/pkg/web/transaction';
import {UserUC} from './port';

export type SavePaymentArgs = {
  method: string;
  fee: string;
};

export type SaveShippingArgs = {
  method: string;
  fee: string;
};

export type SaveProductItemArgs = {
  id: string;
  quantity: string;
};

export type SaveItemArgs = {
  shop_id: string;
  shipping: SaveShippingArgs;
  products: Array<SaveProductItemArgs>;
};

export type SaveOrderArgs = {
  user_id: string;
  payment: SavePaymentArgs;
  items: Array<SaveItemArgs>;
};

export async function saveOrder(
  uc: UserUC,
  args: SaveOrderArgs
): Promise<CreateSalesOrderRow | Error> {
  try {
    await transactionBegin(uc.command);

    let amount = Number(args.payment.fee);
    const userArgs: FindUserByIdArgs = {
      id: args.user_id,
    };
    const userRow = await findUserById(uc.command, userArgs);
    if (userRow === null) {
      await transactionRollback(uc.command);
      throw new Error('User not found!');
    }

    const soArgs: CreateSalesOrderArgs = {
      userId: args.user_id,
      amount: '0',
      paymentMetadata: args.payment,
    };
    const soRow = await createSalesOrder(uc.command, soArgs);
    if (soRow === null) {
      await transactionRollback(uc.command);
      throw new Error('Failed to create sales order!');
    }

    for (const item of args.items) {
      const shopArgs: FindShopByIdArgs = {
        id: item.shop_id,
      };
      const shopRow = await findShopById(uc.command, shopArgs);
      if (shopRow === null) {
        await transactionRollback(uc.command);
        throw new Error('Shop not found!');
      }

      const orderArgs: CreateOrderArgs = {
        salesOrderId: soRow.id,
        userId: args.user_id,
        shopId: item.shop_id,
        amount: '0',
        shippingMetadata: item.shipping,
        userMetadata: userRow,
        shopMetadata: shopRow,
      };
      const orderRow = await createOrder(uc.command, orderArgs);
      if (orderRow === null) {
        await transactionRollback(uc.command);
        throw new Error('Failed to create order!');
      }

      let subAmount = Number(item.shipping.fee);
      const orderItemsArgs: Array<CreateOrderItemArgs> = [];

      for (const product of item.products) {
        const productArgs: FindProductByIdArgs = {
          id: product.id,
        };
        const productRow = await findProductById(uc.command, productArgs);
        if (productRow === null) {
          await transactionRollback(uc.command);
          throw new Error('Product not found!');
        }

        const bookArgs: BookProductStockArgs = {
          id: product.id,
          quantity: String(product.quantity),
        };
        const bookRow = await bookProductStock(uc.command, bookArgs);
        if (bookRow === null) {
          await transactionRollback(uc.command);
          throw new Error('Insuficient stock!');
        }

        orderItemsArgs.push({
          orderId: orderRow.id,
          productId: productRow.id,
          warehouseId: bookRow.warehouseId,
          quantity: product.quantity,
          price: productRow.price,
          productMetadata: productRow,
          warehouseMetadata: {
            id: bookRow.warehouseId,
            name: bookRow.warehouseName,
            location: bookRow.warehouseLocation,
          },
        });

        subAmount += Number(productRow.price) * Number(product.quantity);
      }

      const orderItemRows = await createOrderItems(uc.command, orderItemsArgs);
      if (orderItemRows.length === 0) {
        await transactionRollback(uc.command);
        throw new Error('Failed to create order items!');
      }

      const uOrderArgs: UpdateOrderAmountArgs = {
        id: orderRow.id,
        amount: String(subAmount),
      };
      const uOrderRow = await updateOrderAmount(uc.command, uOrderArgs);
      if (uOrderRow === null) {
        await transactionRollback(uc.command);
        throw new Error('Failed update amount order!');
      }

      amount += subAmount;
    }

    const uSalesOrderArgs: UpdateSalesOrderAmountArgs = {
      id: soRow.id,
      amount: String(amount),
    };
    const uSalesOrderRow = await updateSalesOrderAmount(
      uc.command,
      uSalesOrderArgs
    );
    if (uSalesOrderRow === null) {
      await transactionRollback(uc.command);
      throw new Error('Failed update amount sales order!');
    }

    await transactionCommit(uc.command);

    return soRow;
  } catch (err: unknown) {
    await transactionRollback(uc.command);
    throw parseError(err);
  }
}

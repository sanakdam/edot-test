import {
  createShop,
  CreateShopArgs,
  CreateShopRow,
  CreateWarehouseArgs,
} from '@/gen/shops/command/command_shops_sql';
import {createWarehouses} from '@/gen/shops/command_custom/command_shops_sql';
import {
  createUser,
  CreateUserArgs,
  CreateUserRow,
} from '@/gen/users/command/command_users_sql';
import {findUser, FindUserArgs} from '@/gen/users/query/query_users_sql';
import {parseError} from '@/pkg/helpers/error';
import {validate} from '@/pkg/helpers/hash';
import {register, TokenData} from '@/pkg/middleware/authentication';
import {Context} from '@/pkg/middleware/context';
import {logError, logResult} from '@/pkg/web/tracing';
import {
  transactionBegin,
  transactionCommit,
  transactionRollback,
} from '@/pkg/web/transaction';
import {GuestUC} from './port';

export type RegisterCustomerArgs = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

export type LoginCustomerArgs = {
  username: string;
  password: string;
};

export type RegisterWarehouseArgs = {
  name: string;
  location: string;
};

export type RegisterShopArgs = {
  name: string;
  pic_name: string;
  pic_email: string;
  pic_phone: string;
  password: string;
  warehouses: Array<RegisterWarehouseArgs>;
};

export type LoginShopArgs = {
  username: string;
  password: string;
};

export async function registerCustomer(
  uc: GuestUC,
  ctx: Context,
  args: RegisterCustomerArgs
): Promise<CreateUserRow | null | Error> {
  const span = ctx.req.trace;

  try {
    const userArgs: CreateUserArgs = {
      name: args.name,
      email: args.email,
      phone: args.phone,
      type: 'CUSTOMER',
      password: args.password,
    };
    const row = await createUser(uc.command, userArgs);
    if (row === null) {
      logError(span, {
        type: 'command',
        query: 'createUser',
        payload: userArgs,
      });
      throw new Error('Failed to create user!');
    }

    logResult(span, row);
    return row;
  } catch (err: unknown) {
    logError(span, err);
    throw parseError(err);
  }
}

export async function loginCustomer(
  uc: GuestUC,
  args: LoginCustomerArgs
): Promise<string | Error> {
  try {
    const payload: FindUserArgs = {
      type: 'CUSTOMER',
      username: args.username,
    };
    const row = await findUser(uc.query, payload);
    if (row === null) {
      throw new Error('Customer not found!');
    }

    const valid = await validate(row.password, args.password);
    if (valid === false) {
      throw new Error('Password not valid!');
    }

    const tokenData: TokenData = {
      id: row.id,
      type: row.type,
    };

    const token = register(tokenData);
    return token;
  } catch (err: unknown) {
    throw parseError(err);
  }
}

export async function registerShop(
  uc: GuestUC,
  ctx: Context,
  args: RegisterShopArgs
): Promise<CreateShopRow | null | Error> {
  const span = ctx.req.trace;

  try {
    await transactionBegin(uc.command);

    const userArgs: CreateUserArgs = {
      name: args.pic_name,
      email: args.pic_email,
      phone: args.pic_phone,
      type: 'SHOP',
      password: args.password,
    };
    const userRow = await createUser(uc.command, userArgs);
    if (userRow === null) {
      logError(span, {
        type: 'command',
        query: 'createUser',
        payload: userArgs,
      });
      await transactionRollback(uc.command);
      throw new Error('Failed to create user!');
    }

    logResult(span, userRow);

    const shopArgs: CreateShopArgs = {
      userId: userRow.id,
      name: args.name,
      status: 'ACTIVE',
    };
    const shopRow = await createShop(uc.command, shopArgs);
    if (shopRow === null) {
      logError(span, {
        type: 'command',
        query: 'createShop',
        payload: shopArgs,
      });
      await transactionRollback(uc.command);
      throw new Error('Failed to create shop!');
    }

    const warehousesArgs: Array<CreateWarehouseArgs> = [];
    for (const wh of args.warehouses) {
      warehousesArgs.push({
        shopId: shopRow.id,
        status: 'ACTIVE',
        name: wh.name,
        location: wh.location,
      });
    }

    const warehouseRows = await createWarehouses(uc.command, warehousesArgs);
    if (warehouseRows.length === 0) {
      logError(span, {
        type: 'command',
        query: 'createWarehouses',
        payload: warehousesArgs,
      });
      await transactionRollback(uc.command);
      throw new Error('Failed to create warehouses!');
    }

    await transactionCommit(uc.command);
    logResult(span, shopRow);

    return shopRow;
  } catch (err: unknown) {
    logError(span, err);
    await transactionRollback(uc.command);
    throw parseError(err);
  }
}

export async function loginShop(
  uc: GuestUC,
  args: LoginShopArgs
): Promise<string | Error> {
  try {
    const payload: FindUserArgs = {
      type: 'SHOP',
      username: args.username,
    };
    const row = await findUser(uc.query, payload);
    if (row === null) {
      throw new Error('Shop not found!');
    }

    const valid = await validate(row.password, args.password);
    if (valid === false) {
      throw new Error('Password not valid!');
    }

    const tokenData: TokenData = {
      id: row.id,
      type: row.type,
    };

    const token = register(tokenData);
    return token;
  } catch (err: unknown) {
    throw parseError(err);
  }
}

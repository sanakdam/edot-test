import {GuestUC} from './port';
import {parseError} from '@/pkg/helpers/error';
import {
  createUser,
  CreateUserArgs,
  CreateUserRow,
} from '@/gen/users/command/command_users_sql';
import {findUser, FindUserArgs} from '@/gen/users/query/query_users_sql';
import {validate} from '@/pkg/helpers/hash';

export interface RegisterCustomerArgs {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginCustomerArgs {
  username: string;
  password: string;
}

export async function registerCustomer(
  uc: GuestUC,
  args: RegisterCustomerArgs
): Promise<CreateUserRow | null | Error> {
  try {
    const payload: CreateUserArgs = {
      name: args.name,
      email: args.email,
      phone: args.phone,
      type: 'CUSTOMER',
      password: args.password,
    };
    const row = await createUser(uc.command, payload);
    return row;
  } catch (err: unknown) {
    return parseError(err);
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
    const row = await findUser(uc.command, payload);
    if (row === null) {
      return new Error('Customer not found!');
    }

    const valid = await validate(row.password, args.password);
    if (valid === false) {
      return new Error('Password not valid!');
    }

    return row;
  } catch (err: unknown) {
    return parseError(err);
  }
}

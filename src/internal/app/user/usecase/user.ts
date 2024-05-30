import {
  findUserById,
  FindUserByIdArgs,
  FindUserByIdRow,
} from '@/gen/users/query/query_users_sql';
import {parseError} from '@/pkg/helpers/error';
import {UserUC} from './port';

export type ProfileCustomerArgs = {
  id: string;
};

export async function profileCustomer(
  uc: UserUC,
  args: ProfileCustomerArgs
): Promise<FindUserByIdRow | Error> {
  try {
    const payload: FindUserByIdArgs = {
      id: args.id,
    };
    const row = await findUserById(uc.query, payload);
    if (row === null) {
      throw new Error('Customer not found!');
    }

    return row;
  } catch (err: unknown) {
    throw parseError(err);
  }
}

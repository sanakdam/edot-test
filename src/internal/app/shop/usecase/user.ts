import {parseError} from '@/pkg/helpers/error';
import {ShopUC} from './port';
import {
  findShopByUserId,
  FindShopByUserIdArgs,
  FindShopByUserIdRow,
} from '@/gen/shops/query/query_shops_sql';

export type ProfileShopArgs = {
  id: string;
};

export async function profileShop(
  uc: ShopUC,
  args: ProfileShopArgs
): Promise<FindShopByUserIdRow | Error> {
  try {
    const payload: FindShopByUserIdArgs = {
      userId: args.id,
    };
    const row = await findShopByUserId(uc.query, payload);
    if (row === null) {
      throw new Error('Shop not found!');
    }

    return row;
  } catch (err: unknown) {
    throw parseError(err);
  }
}

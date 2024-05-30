import {
  findProducts,
  FindProductsArgs,
  FindProductsRow,
} from '@/gen/shops/query/query_shops_sql';
import {parseError} from '@/pkg/helpers/error';
import {GuestUC} from './port';

export type ListProductArgs = {
  limit: number;
  offset: number;
};

export async function listProduct(
  uc: GuestUC,
  args: ListProductArgs
): Promise<Array<FindProductsRow> | Error> {
  try {
    const payload: FindProductsArgs = {
      pageLimit: String(args.limit),
      pageOffset: String(args.offset),
    };
    const rows = await findProducts(uc.query, payload);

    return rows;
  } catch (err: unknown) {
    throw parseError(err);
  }
}

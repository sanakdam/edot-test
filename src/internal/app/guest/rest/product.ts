import {GuestUC} from '@/internal/app/guest/usecase/port';
import {
  listProduct,
  ListProductArgs,
} from '@/internal/app/guest/usecase/product';
import {Context} from '@/pkg/middleware/context';
import {webError, webOK} from '@/pkg/web/response';
import {validator} from '@/pkg/web/validator';
import {Schema} from 'express-validator';

const schemaListProduct: Schema = {
  offset: {
    isNumeric: true,
    errorMessage: 'Offset cannot be empty!',
  },
  limit: {
    isNumeric: true,
    errorMessage: 'Limit cannot be empty!',
  },
};

export async function handleListProduct(uc: GuestUC, ctx: Context) {
  try {
    const validate = await validator(ctx.req, schemaListProduct);
    if (validate !== null) {
      return webError(ctx.res, {
        code: 400,
        error: new Error(validate.msg),
      });
    }

    const query = ctx.req.query;
    const args: ListProductArgs = {
      limit: Number(query.limit),
      offset: Number(query.offset),
    };

    const products = await listProduct(uc, args);

    return webOK(ctx.res, {
      code: 200,
      message: 'Success get list product',
      data: products,
    });
  } catch (err: unknown) {
    return webError(ctx.res, {code: 400, error: err});
  }
}

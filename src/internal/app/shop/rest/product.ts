import {ShopUC} from '@/internal/app/shop/usecase/port';
import {
  saveProduct,
  SaveProductArgs,
} from '@/internal/app/shop/usecase/product';
import {Context} from '@/pkg/middleware/context';
import {webError, webOK} from '@/pkg/web/response';
import {validator} from '@/pkg/web/validator';
import {Schema} from 'express-validator';

const schemaCreateProduct: Schema = {
  name: {
    notEmpty: true,
    errorMessage: 'Name cannot be empty!',
  },
  description: {
    notEmpty: true,
    errorMessage: 'Description cannot be empty!',
  },
  price: {
    isNumeric: true,
    errorMessage: 'Price cannot be empty!',
  },
  product_stocks: {
    isArray: {
      options: {min: 1},
      errorMessage: 'Product should be at least 1 stock warehouse!',
    },
  },
  'product_stocks.*.warehouse_id': {
    notEmpty: true,
    errorMessage: 'Stock warehouse cannot be empty!',
  },
  'product_stocks.*.quantity': {
    notEmpty: true,
    errorMessage: 'Stock quantity cannot be empty!',
  },
};

export async function handleSaveProduct(uc: ShopUC, ctx: Context) {
  try {
    const validate = await validator(ctx.req, schemaCreateProduct);
    if (validate !== null) {
      return webError(ctx.res, {
        code: 400,
        error: new Error(validate.msg),
      });
    }

    const auth = ctx.req.auth;
    const body = ctx.req.body;
    const args: SaveProductArgs = {
      user_id: auth.id,
      name: body.name,
      price: body.price,
      description: body.description,
      product_stocks: body.product_stocks,
    };

    const product = await saveProduct(uc, args);

    return webOK(ctx.res, {
      code: 200,
      message: 'Success create product',
      data: product,
    });
  } catch (err: unknown) {
    return webError(ctx.res, {code: 400, error: err});
  }
}

import {GuestUC} from '@/internal/app/guest/usecase/port';
import {saveOrder, SaveOrderArgs} from '@/internal/app/user/usecase/order';
import {Context} from '@/pkg/middleware/context';
import {webError, webOK} from '@/pkg/web/response';
import {validator} from '@/pkg/web/validator';
import {Schema} from 'express-validator';

const schemaSaveOrder: Schema = {
  'payment.method': {
    notEmpty: true,
    errorMessage: 'Payment method cannot be empty!',
  },
  'payment.fee': {
    isNumeric: true,
    errorMessage: 'Payment fee cannot be empty!',
  },
  items: {
    isArray: {
      options: {min: 1},
      errorMessage: 'Items should be at least 1 order!',
    },
  },
  'items.*.shop_id': {
    notEmpty: true,
    errorMessage: 'Shop identifier cannot be empty!',
  },
  'items.*.shipping.method': {
    notEmpty: true,
    errorMessage: 'Shipping method cannot be empty!',
  },
  'items.*.shipping.fee': {
    notEmpty: true,
    errorMessage: 'Shipping fee cannot be empty!',
  },
  'items.*.products': {
    isArray: {
      options: {min: 1},
      errorMessage: 'Product items should be at least 1 product!',
    },
  },
  'items.*.products.*.id': {
    notEmpty: true,
    errorMessage: 'Product identifier cannot be empty!',
  },
  'items.*.products.*.quantity': {
    isNumeric: true,
    errorMessage: 'Product quantity cannot be empty!',
  },
};

export async function handleSaveOrder(uc: GuestUC, ctx: Context) {
  try {
    const validate = await validator(ctx.req, schemaSaveOrder);
    if (validate !== null) {
      return webError(ctx.res, {
        code: 400,
        error: new Error(validate.msg),
      });
    }

    const auth = ctx.req.auth;
    const body = ctx.req.body;
    const args: SaveOrderArgs = {
      user_id: auth.id,
      payment: body.payment,
      items: body.items,
    };

    const salesOrder = await saveOrder(uc, args);

    return webOK(ctx.res, {
      code: 200,
      message: 'Success save order',
      data: salesOrder,
    });
  } catch (err: unknown) {
    return webError(ctx.res, {code: 400, error: err});
  }
}

import {GuestUC} from '@/internal/app/guest/usecase/port';
import {
  loginCustomer,
  LoginCustomerArgs,
  loginShop,
  LoginShopArgs,
  registerCustomer,
  RegisterCustomerArgs,
  registerShop,
  RegisterShopArgs,
} from '@/internal/app/guest/usecase/user';
import {generate} from '@/pkg/helpers/hash';
import {Context} from '@/pkg/middleware/context';
import {webError, webOK} from '@/pkg/web/response';
import {
  logError,
  logRequest,
  logResponse,
  tracingStart,
} from '@/pkg/web/tracing';
import {validator} from '@/pkg/web/validator';
import {Schema} from 'express-validator';

const schemaRegisterCustomer: Schema = {
  name: {
    notEmpty: true,
    errorMessage: 'Name cannot be empty!',
  },
  phone: {
    notEmpty: true,
    errorMessage: 'Phone cannot be empty!',
  },
  email: {
    isEmail: true,
    errorMessage: 'Email is invalid!',
  },
  password: {
    isLength: {
      options: {min: 6},
      errorMessage: 'Password should be at least 6 chars',
    },
  },
};

const schemaLoginCustomer: Schema = {
  username: {
    notEmpty: true,
    errorMessage: 'Phone or email cannot be empty!',
  },
  password: {
    notEmpty: true,
    errorMessage: 'Password cannot be empty!',
  },
};

const schemaRegisterShop: Schema = {
  pic_name: {
    notEmpty: true,
    errorMessage: 'PIC name cannot be empty!',
  },
  pic_phone: {
    notEmpty: true,
    errorMessage: 'PIC phone cannot be empty!',
  },
  pic_email: {
    isEmail: true,
    errorMessage: 'PIC email is invalid!',
  },
  name: {
    notEmpty: true,
    errorMessage: 'Name cannot be empty!',
  },
  password: {
    isLength: {
      options: {min: 6},
      errorMessage: 'Password should be at least 6 chars!',
    },
  },
  warehouses: {
    isArray: {
      options: {min: 1},
      errorMessage: 'Warehouse should be at least 1 location!',
    },
  },
  'warehouses.*.name': {
    notEmpty: true,
    errorMessage: 'Warehouses name cannot be empty!',
  },
  'warehouses.*.location': {
    notEmpty: true,
    errorMessage: 'Warehouses location cannot be empty!',
  },
};

const schemaLoginShop: Schema = {
  username: {
    notEmpty: true,
    errorMessage: 'Phone or email cannot be empty!',
  },
  password: {
    notEmpty: true,
    errorMessage: 'Password cannot be empty!',
  },
};

export async function handlerRegisterCustomer(uc: GuestUC, ctx: Context) {
  const {span, ctx: newCtx} = tracingStart(ctx, 'register-customer');

  try {
    logRequest(span, ctx.req.body);
    const validate = await validator(newCtx.req, schemaRegisterCustomer);
    if (validate !== null) {
      logError(span, validate);
      return webError(newCtx.res, {
        code: 400,
        error: new Error(validate.msg),
      });
    }

    const body = newCtx.req.body;
    const password = await generate(body.password);
    const args: RegisterCustomerArgs = {
      name: body.name,
      email: body.email,
      phone: body.phone,
      password: password,
    };

    const customer = await registerCustomer(uc, newCtx, args);
    if (customer === null) {
      logError(span, 'Something happened!');
      return webError(newCtx.res, {
        code: 400,
        error: new Error('Something happened!'),
      });
    }

    logResponse(span, customer);
    return webOK(newCtx.res, {
      code: 200,
      message: 'Success register as customer',
    });
  } catch (err: unknown) {
    logError(span, err);
    return webError(newCtx.res, {code: 400, error: err});
  }
}

export async function handleLoginCustomer(uc: GuestUC, ctx: Context) {
  try {
    const validate = await validator(ctx.req, schemaLoginCustomer);
    if (validate !== null) {
      return webError(ctx.res, {
        code: 400,
        error: new Error(validate.msg),
      });
    }

    const body = ctx.req.body;
    const args: LoginCustomerArgs = {
      username: body.username,
      password: body.password,
    };

    const token = await loginCustomer(uc, args);

    return webOK(ctx.res, {
      code: 200,
      message: 'Success login as customer',
      data: token,
    });
  } catch (err: unknown) {
    return webError(ctx.res, {code: 400, error: err});
  }
}

export async function handlerRegisterShop(uc: GuestUC, ctx: Context) {
  const {span, ctx: newCtx} = tracingStart(ctx, 'register-shop');

  try {
    logRequest(span, ctx.req.body);
    const validate = await validator(newCtx.req, schemaRegisterShop);
    if (validate !== null) {
      logError(span, validate);
      return webError(newCtx.res, {
        code: 400,
        error: new Error(validate.msg),
      });
    }

    const body = newCtx.req.body;
    const password = await generate(body.password);

    const args: RegisterShopArgs = {
      name: body.name,
      pic_name: body.pic_name,
      pic_email: body.pic_email,
      pic_phone: body.pic_phone,
      password: password,
      warehouses: body.warehouses,
    };

    const shop = await registerShop(uc, newCtx, args);
    if (shop === null) {
      logError(span, 'Something happened!');
      return webError(newCtx.res, {
        code: 400,
        error: new Error('Something happened!'),
      });
    }

    logResponse(span, shop);
    return webOK(newCtx.res, {
      code: 200,
      message: 'Success register as shop',
    });
  } catch (err: unknown) {
    logError(span, err);
    return webError(newCtx.res, {code: 400, error: err});
  }
}

export async function handleLoginShop(uc: GuestUC, ctx: Context) {
  try {
    const validate = await validator(ctx.req, schemaLoginShop);
    if (validate !== null) {
      return webError(ctx.res, {
        code: 400,
        error: new Error(validate.msg),
      });
    }

    const body = ctx.req.body;
    const args: LoginShopArgs = {
      username: body.username,
      password: body.password,
    };

    const token = await loginShop(uc, args);

    return webOK(ctx.res, {
      code: 200,
      message: 'Success login as shop',
      data: token,
    });
  } catch (err: unknown) {
    return webError(ctx.res, {code: 400, error: err});
  }
}

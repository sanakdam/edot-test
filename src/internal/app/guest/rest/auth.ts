import {GuestUC} from '@/internal/app/guest/usecase/port';
import {Context} from '@/pkg/middleware/context';
import {CreateUserArgs} from '@/gen/users/command/command_users_sql';
import {webError, webOK} from '@/pkg/web/response';
import {
  registerCustomer,
  RegisterCustomerArgs,
} from '@/internal/app/guest/usecase/auth';
import {validator} from '@/pkg/web/validator';
import {Schema} from 'express-validator';
import {generate} from '@/pkg/helpers/hash';

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

export async function handlerRegisterCustomer(uc: GuestUC, ctx: Context) {
  try {
    const validate = await validator(ctx.req, schemaRegisterCustomer);
    if (validate !== null) {
      return webError(ctx.res, {
        code: 400,
        error: new Error(validate.msg),
      });
    }

    const body = ctx.req.body;
    const password = await generate(body.password);
    const args: RegisterCustomerArgs = {
      name: body.name,
      email: body.email,
      phone: body.phone,
      password: password,
    };

    const customer = await registerCustomer(uc, args);
    if (customer === null) {
      return webError(ctx.res, {
        code: 400,
        error: new Error('Something happened!'),
      });
    }

    return webOK(ctx.res, {
      code: 200,
      message: 'Success register as customer',
    });
  } catch (err: unknown) {
    return webError(ctx.res, {code: 400, error: err});
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
    const password = await generate(body.password);
    const args: CreateUserArgs = {
      name: body.name,
      email: body.email,
      phone: body.phone,
      type: 'CUSTOMER',
      password: password,
    };

    const customer = await registerCustomer(uc, args);
    if (customer === null) {
      return webError(ctx.res, {
        code: 400,
        error: new Error('Something happened!'),
      });
    }

    return webOK(ctx.res, {
      code: 200,
      message: 'Success register as customer',
    });
  } catch (err: unknown) {
    return webError(ctx.res, {code: 400, error: err});
  }
}

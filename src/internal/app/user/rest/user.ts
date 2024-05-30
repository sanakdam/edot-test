import {UserUC} from '@/internal/app/user/usecase/port';
import {
  profileCustomer,
  ProfileCustomerArgs,
} from '@/internal/app/user/usecase/user';
import {Context} from '@/pkg/middleware/context';
import {webError, webOK} from '@/pkg/web/response';

export async function handleProfileCustomer(uc: UserUC, ctx: Context) {
  try {
    const auth = ctx.req.auth;
    const args: ProfileCustomerArgs = {
      id: auth.id,
    };

    const user = await profileCustomer(uc, args);

    return webOK(ctx.res, {
      code: 200,
      message: 'Success get profile',
      data: user,
    });
  } catch (err: unknown) {
    return webError(ctx.res, {code: 400, error: err});
  }
}

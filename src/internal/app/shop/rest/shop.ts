import {ShopUC} from '@/internal/app/shop/usecase/port';
import {profileShop, ProfileShopArgs} from '@/internal/app/shop/usecase/user';
import {Context} from '@/pkg/middleware/context';
import {webError, webOK} from '@/pkg/web/response';

export async function handleProfileShop(uc: ShopUC, ctx: Context) {
  try {
    const auth = ctx.req.auth;
    const args: ProfileShopArgs = {
      id: auth.id,
    };

    const shop = await profileShop(uc, args);

    return webOK(ctx.res, {
      code: 200,
      message: 'Success get profile',
      data: shop,
    });
  } catch (err: unknown) {
    return webError(ctx.res, {code: 400, error: err});
  }
}

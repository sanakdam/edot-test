import {Request, Response, NextFunction} from 'express';
import {config} from '@/config/config';
import {Pool} from 'pg';
import {Context} from '@/pkg/middleware/context';

export type ShopUC = {
  query: Pool;
  command: Pool;
};

export function shopContext(
  req: Request,
  res: Response,
  next: NextFunction,
  forward: (uc: ShopUC, ctx: Context) => Response | Promise<Response>
) {
  const uc: ShopUC = {
    query: config.dbRead(),
    command: config.dbWrite(),
  };

  const ctx: Context = {
    req,
    res,
    next,
  };

  forward(uc, ctx);
}

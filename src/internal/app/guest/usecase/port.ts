import {Request, Response, NextFunction} from 'express';
import {config} from '@/config/config';
import {Pool} from 'pg';
import {Context} from '@/pkg/middleware/context';

export type GuestUC = {
  query: Pool;
  command: Pool;
};

export function guestContext(
  req: Request,
  res: Response,
  next: NextFunction,
  forward: (uc: GuestUC, ctx: Context) => Response | Promise<Response>
) {
  const uc: GuestUC = {
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

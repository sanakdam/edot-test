import {Request, Response, NextFunction} from 'express';
import {config} from '@/config/config';
import {Pool} from 'pg';
import {Context} from '@/pkg/middleware/context';

export type UserUC = {
  query: Pool;
  command: Pool;
};

export function userContext(
  req: Request,
  res: Response,
  next: NextFunction,
  forward: (uc: UserUC, ctx: Context) => Response | Promise<Response>
) {
  const uc: UserUC = {
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

import {Request, Response, NextFunction} from 'express';

export type Context = {
  req: Request;
  res: Response;
  next: NextFunction;
};

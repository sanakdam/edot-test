/* eslint-disable @typescript-eslint/no-explicit-any */

import {Response} from 'express';
import {parseError} from '@/pkg/helpers/error';

export type OkResponse = {
  code: number;
  message: string;
  data?: any;
};

export type ErrorResponse = {
  code: number;
  error: unknown;
};

export function webOK(res: Response, args: OkResponse): Response {
  return res.status(args.code).json({message: args.message, data: args.data});
}

export function webError(res: Response, args: ErrorResponse): Response {
  const err = parseError(args.error);

  return res.status(args.code).json({message: err.message});
}

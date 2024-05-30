import {NextFunction, Request, Response} from 'express';
import {sign, verify} from 'jsonwebtoken';
import {config} from '@/config/config';
import {webError} from '../web/response';

export type TokenData = {
  id: string;
  type: string;
};

export function register(args: TokenData): string {
  const secret = config.get().app.secret;
  return sign(args, secret, {expiresIn: '1800s'});
}

export function claim(token: string): TokenData | null {
  try {
    const secret = config.get().app.secret;
    const payload = verify(token, secret);
    if (typeof payload === 'string') {
      return null;
    }

    return payload as TokenData;
  } catch (_: unknown) {
    return null;
  }
}

export function customerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Response | void {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (token === undefined) {
    return webError(res, {
      code: 401,
      error: new Error('Unauthorized!'),
    });
  }

  const tokenData = claim(token);
  if (tokenData === null || tokenData.type !== 'CUSTOMER') {
    return webError(res, {
      code: 401,
      error: new Error('Token invalid or expired!'),
    });
  }

  req.auth = tokenData;

  next();
}

export function shopMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Response | void {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (token === undefined) {
    return webError(res, {
      code: 401,
      error: new Error('Unauthorized!'),
    });
  }

  const tokenData = claim(token);
  if (tokenData === null || tokenData.type !== 'SHOP') {
    return webError(res, {
      code: 401,
      error: new Error('Token invalid or expired!'),
    });
  }

  req.auth = tokenData;

  next();
}

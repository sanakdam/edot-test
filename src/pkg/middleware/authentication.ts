import {sign, verify} from 'jsonwebtoken';
import {config} from '@/config/config';

export type TokenData = {
  id: number;
  type: string;
};

export function register(args: TokenData): string {
  const secret = config.get().app.secret;
  return sign(args, secret, {expiresIn: '1800s'});
}

export function claim(token: string): TokenData | null {
  const secret = config.get().app.secret;
  const payload = verify(token, secret);
  if (typeof payload === 'string') {
    return null;
  }

  return payload as TokenData;
}

import {Tracing} from '@/pkg/web/tracing';
import {TokenData} from '@/pkg/middleware/authentication';

declare global {
  namespace Express {
    export interface Request {
      auth: TokenData;
      trace: Tracing;
    }
  }
}

import {Request, Response, NextFunction} from 'express';
import {RateLimiterMemory} from 'rate-limiter-flexible';
import {webError} from '../web/response';

const rateLimit = new RateLimiterMemory({
  points: 10,
  duration: 1,
});

export function rateLimiter(
  req: Request,
  res: Response,
  next: NextFunction
): Response | void {
  try {
    if (req.ip === undefined) {
      return webError(res, {
        code: 426,
        error: new Error('Bot detected!'),
      });
    }

    rateLimit.consume(req.ip);
    next();
  } catch (_: unknown) {
    return webError(res, {
      code: 426,
      error: new Error('Too many request!'),
    });
  }
}

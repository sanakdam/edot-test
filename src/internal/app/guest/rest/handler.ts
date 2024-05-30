import express, {Router, Request, Response, NextFunction} from 'express';
import {guestContext} from '@/internal/app/guest/usecase/port';
import {handleLoginCustomer, handlerRegisterCustomer} from './auth';

export default function handler(): Router {
  const router = express.Router({mergeParams: true});

  router.post(
    '/register-customer',
    (req: Request, res: Response, next: NextFunction) =>
      guestContext(req, res, next, handlerRegisterCustomer)
  );

  router.post(
    '/login-customer',
    (req: Request, res: Response, next: NextFunction) =>
      guestContext(req, res, next, handleLoginCustomer)
  );
  return router;
}

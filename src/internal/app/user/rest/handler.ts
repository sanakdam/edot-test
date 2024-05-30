import {userContext} from '@/internal/app/user/usecase/port';
import {customerMiddleware} from '@/pkg/middleware/authentication';
import express, {NextFunction, Request, Response, Router} from 'express';
import {handleProfileCustomer} from './user';
import {handleSaveOrder} from './order';

export default function handler(): Router {
  const router = express.Router({mergeParams: true});

  router.use(customerMiddleware);

  router.get('/profile', (req: Request, res: Response, next: NextFunction) =>
    userContext(req, res, next, handleProfileCustomer)
  );

  router.post('/order', (req: Request, res: Response, next: NextFunction) =>
    userContext(req, res, next, handleSaveOrder)
  );

  return router;
}

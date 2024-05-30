import express, {Router, Request, Response, NextFunction} from 'express';
import {guestContext} from '@/internal/app/guest/usecase/port';
import {
  handleLoginCustomer,
  handlerRegisterCustomer,
  handlerRegisterShop,
  handleLoginShop,
} from './user';
import {handleListProduct} from './product';

export default function handler(): Router {
  const router = express.Router({mergeParams: true});

  router.post(
    '/register/customer',
    (req: Request, res: Response, next: NextFunction) =>
      guestContext(req, res, next, handlerRegisterCustomer)
  );

  router.post(
    '/register/shop',
    (req: Request, res: Response, next: NextFunction) =>
      guestContext(req, res, next, handlerRegisterShop)
  );

  router.post(
    '/login/customer',
    (req: Request, res: Response, next: NextFunction) =>
      guestContext(req, res, next, handleLoginCustomer)
  );

  router.post(
    '/login/shop',
    (req: Request, res: Response, next: NextFunction) =>
      guestContext(req, res, next, handleLoginShop)
  );

  router.get('/product', (req: Request, res: Response, next: NextFunction) =>
    guestContext(req, res, next, handleListProduct)
  );

  return router;
}

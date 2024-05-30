import {shopContext} from '@/internal/app/shop/usecase/port';
import {shopMiddleware} from '@/pkg/middleware/authentication';
import express, {NextFunction, Request, Response, Router} from 'express';
import {handleProfileShop} from './shop';
import {handleSaveProduct} from './product';

export default function handler(): Router {
  const router = express.Router({mergeParams: true});

  router.use(shopMiddleware);

  router.get('/profile', (req: Request, res: Response, next: NextFunction) =>
    shopContext(req, res, next, handleProfileShop)
  );

  router.post('/product', (req: Request, res: Response, next: NextFunction) =>
    shopContext(req, res, next, handleSaveProduct)
  );

  return router;
}

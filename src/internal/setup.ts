import express, {Express} from 'express';
import userHandler from '@/internal/app/user/rest/handler';
import guestHandler from '@/internal/app/guest/rest/handler';

export default function setup(app: Express) {
  const router = express.Router();

  router.use('/', guestHandler());
  router.use('/user', userHandler());

  app.use('/v1', router);
}

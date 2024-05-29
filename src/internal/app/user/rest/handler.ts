import express, {Router, Request, Response, NextFunction} from 'express';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  console.log('Time:', Date.now());
  next();
};

export default function handler(): Router {
  const router = express.Router({mergeParams: true});

  router.use(authMiddleware);

  router.get('/', (req: Request, res: Response) =>
    res.send({message: 'HELLO'})
  );
  return router;
}

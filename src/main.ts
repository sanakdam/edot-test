import express, {Express} from 'express';
import {initConfig, config} from '@/config/config';
import setupApp from '@/internal/setup';
import helmet from 'helmet';
import {rateLimiter} from '@/pkg/middleware/rate_limiter';

function initServer(): Express {
  const app = express();

  app.use(express.json());
  app.use(helmet());
  app.use(rateLimiter);

  return app;
}

function main() {
  const err = initConfig();
  if (err !== null) {
    console.error(err);
    return;
  }

  const app = initServer();

  setupApp(app);

  const port = config.get().app.port;

  app.listen(port, () => {
    return console.log(
      `Express server is listening at http://localhost:${port} 🚀`
    );
  });

  return app;
}

export default main();

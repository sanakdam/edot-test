import express, {Express} from 'express';
import {initConfig, config} from '@/config/config';
import setupApp from '@/internal/setup';

function initServer(): Express {
  const app = express();

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

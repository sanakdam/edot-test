import {PoolConfig, Pool} from 'pg';
import {load} from 'js-yaml';
import {readFileSync} from 'node:fs';
import {parseError} from '@/pkg/helpers/error';

type AppConfig = {
  name: string;
  host: string;
  port: string;
  secret: string;
  version: string;
};

type DBConfig = {
  primary: PoolConfig;
};

type Config = {
  app: AppConfig;
  database: DBConfig;
};

let appConfig: Config;
let poolRead: Pool, poolWrite: Pool;

export function initConfig(): Error | null {
  try {
    const reader = readFileSync('./config.yaml', 'utf8');
    appConfig = load(reader) as Config;

    const pool = new Pool(appConfig.database.primary);
    poolRead = pool;
    poolWrite = pool;

    return null;
  } catch (err: unknown) {
    return parseError(err);
  }
}

function get(): Config {
  return appConfig;
}

function dbWrite(): Pool {
  return poolWrite;
}

function dbRead(): Pool {
  return poolRead;
}

export const config = {
  get,
  dbWrite,
  dbRead,
};

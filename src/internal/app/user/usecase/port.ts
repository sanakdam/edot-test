import {config} from '@/config/config';
import {Pool} from 'pg';

export type IUserUC = {
  query: Pool;
  command: Pool;
};

export class UserUC implements IUserUC {
  query: Pool = config.dbRead();
  command: Pool = config.dbWrite();
}

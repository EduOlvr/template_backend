import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import config from 'config';
import { resolve } from 'path';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions.js';

type IConfig = TypeOrmModuleOptions & PostgresConnectionOptions;

const {
  type,
  host,
  port,
  username,
  password,
  database,
  synchronize,
  migrationsRun,
  logging,
} = config.get<IConfig>('db');

export default {
  type,
  host,
  port,
  username,
  password,
  database,
  synchronize,
  migrationsRun,
  logging,
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
  entities: [resolve(__dirname, '..', '**/*.entity{.ts,.js}')],
  migrations: [resolve(__dirname, '..', 'db/migration/**/*{.ts,.js}')],

  migrationsTableName: 'migrations_typeorm',

  cli: {
    migrationsDir: 'src/db/migration',
    entitiesDir: resolve(__dirname, 'src'),
  },
} as TypeOrmModuleOptions;

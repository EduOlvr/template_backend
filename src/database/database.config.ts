import config from 'config';
import { resolve } from 'path';
import { DataSourceOptions } from 'typeorm';

interface DbConfig {
  type: 'postgres' | 'sqlite';
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
  logging: boolean;
  migrationsRun?: boolean;
}

const dbConfig: DbConfig = config.get('db') as DbConfig;

export const databaseConfig: DataSourceOptions = {
  type: dbConfig.type,
  host: process.env.DB_HOST || dbConfig.host,
  port: parseInt(process.env.DB_PORT || dbConfig.port.toString()),
  username: process.env.DB_USERNAME || dbConfig.username,
  password: process.env.DB_PASSWORD || dbConfig.password,
  database: process.env.DB_NAME || dbConfig.database,
  synchronize: process.env.TYPEORM_SYNC === 'true' || dbConfig.synchronize,
  logging: process.env.TYPEORM_LOGGING === 'true' || dbConfig.logging,
  entities: [resolve(__dirname, 'entities/**/*.entity{.ts,.js}')],
  migrations: [resolve(__dirname, 'migrations/**/*{.ts,.js}')],
  migrationsTableName: 'migrations_typeorm',
  ...(dbConfig.migrationsRun && { migrationsRun: dbConfig.migrationsRun }),
  ...(process.env.NODE_ENV === 'production' && {
    ssl: { rejectUnauthorized: false },
  }),
  extra: {
    timezone: 'UTC',
  },
} as DataSourceOptions;

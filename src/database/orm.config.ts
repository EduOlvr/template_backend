import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { databaseConfig } from './database.config';

export default databaseConfig as TypeOrmModuleOptions;

import { DataSource } from 'typeorm';
import { databaseConfig } from './database.config';

const AppDataSource = new DataSource(databaseConfig);

export default AppDataSource;

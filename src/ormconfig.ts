import { SnakeNamingStrategy } from './snake-naming.strategy';
import dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
dotenv.config();
const env = process.env as Record<string, string | undefined>;

dotenv.config({
  path: env.NODE_ENV ? `.${env.NODE_ENV}.env` : '.env',
});

// Replace \\n with \n to support multiline strings in AWS
for (const envName of Object.keys(env)) {
  env[envName] = env[envName]?.replace(/\\n/g, '\n');
}

export const typeormConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: env.DB_HOST,
  port: +(env.DB_PORT || '3306'),
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_DATABASE,
  namingStrategy: new SnakeNamingStrategy(),
  migrationsTableName: '__migrations',
  entities: ['dist/**/*.entity.js'],
  subscribers: ['dist/**/*.subscriber.js'],
  migrations: ['dist/databases/migrations/**/*.js'],
};

const dataSource = new DataSource(typeormConfig as DataSourceOptions);

export default dataSource;

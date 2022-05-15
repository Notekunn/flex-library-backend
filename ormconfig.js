const dotenv = require('dotenv');
const { env } = require('process');

const { SnakeNamingStrategy } = require('./dist/snake-naming.strategy');

dotenv.config({
  path: env.NODE_ENV ? `.${env.NODE_ENV}.env` : '.env',
});

// Replace \\n with \n to support multiline strings in AWS
for (const envName of Object.keys(env)) {
  env[envName] = env[envName].replace(/\\n/g, '\n');
}

module.exports = {
  type: 'mysql',
  host: env.DB_HOST,
  port: +env.DB_PORT,
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_DATABASE,
  namingStrategy: new SnakeNamingStrategy(),
  cli: {
    migrationsDir: 'src/databases/migrations',
  },
  multipleStatements: true,
  migrationsTableName: '__migrations',
  entities: ['dist/**/*.entity.js'],
  subscribers: ['dist/**/*.subscriber.js'],
  migrations: ['dist/databases/migrations/**/*.js'],
  seeds: ['dist/databases/seeds/**/*.js'],
  factories: ['dist/databases/factories/**/*.js'],
};

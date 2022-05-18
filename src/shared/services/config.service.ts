import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { env } from 'process';

import { typeormConfig } from '../../ormconfig';

export class ConfigService {
  constructor() {
    dotenv.config({
      path: env.NODE_ENV ? `.${env.NODE_ENV}.env` : '.env',
    });

    // Replace \\n with \n to support multiline strings in AWS
    for (const envName of Object.keys(env)) {
      env[envName] = (env[envName] || '').replace(/\\n/g, '\n');
    }
  }

  get nodeEnv(): string {
    return this.get('NODE_ENV');
  }

  get typeOrmConfig(): TypeOrmModuleOptions {
    return typeormConfig;
  }

  public get(key: string): string {
    return env[key] || '';
  }

  public getNumber(key: string): number {
    return Number(this.get(key));
  }
}

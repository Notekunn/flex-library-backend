import { HealthcheckModule } from '@modules/healthcheck/healthcheck.module';
import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HeaderResolver, I18nJsonLoader, I18nModule, QueryResolver } from 'nestjs-i18n';
import * as path from 'path';
import { env } from 'process';
import { SharedModule } from 'shared.module';

import { ConfigService } from './shared/services/config.service';
import { UserModule } from '@modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { StoreModule } from './modules/store/store.module';
import { BookModule } from './modules/book/book.module';
import { CategoryModule } from './modules/category/category.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (configService: ConfigService) => configService.typeOrmConfig,
      inject: [ConfigService],
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en_US',
      loader: I18nJsonLoader,
      loaderOptions: {
        path: path.join(__dirname, './i18n/'),
        // add this to enable live translations
        watch: !env.NODE_ENV || env.NODE_ENV === 'development',
      },
      resolvers: [new QueryResolver(['lang', 'locale', 'l']), new HeaderResolver()],
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 30,
    }),
    SharedModule,
    HealthcheckModule,
    UserModule,
    AuthModule,
    StoreModule,
    BookModule,
    CategoryModule,
  ],
})
export class AppModule {}

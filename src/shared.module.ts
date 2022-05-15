import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { GeneratorService } from '@shared/generator.service';
import { ConfigService } from '@shared/services/config.service';

const providers = [ConfigService, GeneratorService];

@Global()
@Module({
  providers,
  imports: [
    HttpModule,
    JwtModule.registerAsync({
      imports: [SharedModule],
      useFactory: () => ({
        secret: '// TODO:REPLACE_TO_SECURE_KEY',
        // if you want to use token with expiration date
        // signOptions: {
        //     expiresIn: configService.getNumber('JWT_EXPIRATION_TIME'),
        // },
      }),
    }),
  ],
  exports: [...providers, HttpModule, JwtModule],
})
export class SharedModule {}

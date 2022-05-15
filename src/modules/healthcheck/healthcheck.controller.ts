import { Controller, Get, Logger } from '@nestjs/common';

import { HealthcheckResponse } from './dto/healthcheck-response.dto';

@Controller('healthcheck')
export class HealthcheckController {
  private readonly logger = new Logger(HealthcheckController.name);

  @Get('/')
  heathcheck(): HealthcheckResponse {
    this.logger.log('heathcheck');

    return {
      version: 'v1.0.0',
    };
  }
}

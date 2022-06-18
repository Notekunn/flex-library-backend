import { Controller, Get, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { HealthcheckResponse } from './dto/healthcheck-response.dto';
import { version } from '../../../package.json';

@Controller('healthcheck')
@ApiTags('system')
export class HealthcheckController {
  private readonly logger = new Logger(HealthcheckController.name);

  @Get('/')
  heathcheck(): HealthcheckResponse {
    this.logger.log('heathcheck');

    return {
      version,
    };
  }
}

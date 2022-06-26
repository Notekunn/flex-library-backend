import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('loans')
@Controller('loans')
export class BookLoanController {}

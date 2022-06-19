import { BookStatus } from '@constants/book-status.enum';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { CreateBookCopyDto } from './create-book-copy.dto';

export class UpdateBookCopyDto extends PartialType(CreateBookCopyDto) {
  @ApiProperty({ required: false })
  @IsEnum(BookStatus)
  status?: BookStatus;
}

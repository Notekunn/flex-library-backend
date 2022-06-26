import { PaginationDto } from '@common/dto/pagination.dto';
import { BookStatus } from '@constants/book-status.enum';

export class GetAllBookCopyDto extends PaginationDto {
  status: BookStatus;

  constructor(partial: Partial<GetAllBookCopyDto>) {
    super();
    Object.assign(this, partial);
  }
}

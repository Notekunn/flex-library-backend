import { CreateBookCommandHandler } from './create-book.command';
import { DeleteBookCommandHandler } from './delete-book.command';
import { IncreaseRentCountCommandHandler } from './increase-rentcount.command';
import { UpdateBookCommandHandler } from './update-book.command';
import { UpdateNumberOfCopiesCommandHandler } from './update-number-of-copies.command';

export const BookCommandHandlers = [
  CreateBookCommandHandler,
  DeleteBookCommandHandler,
  UpdateBookCommandHandler,
  IncreaseRentCountCommandHandler,
  UpdateNumberOfCopiesCommandHandler,
];

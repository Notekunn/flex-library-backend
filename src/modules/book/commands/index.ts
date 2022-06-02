import { CreateBookCommandHandler } from './create-book.command';
import { DeleteBookCommandHandler } from './delete-book.command';
import { UpdateBookCommandHandler } from './update-book.command';

export const BookCommandHandlers = [CreateBookCommandHandler, DeleteBookCommandHandler, UpdateBookCommandHandler];

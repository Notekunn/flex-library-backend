import { CreateBookCommand } from './create-book.command';
import { DeleteBookCommand } from './delete-book.command';
import { UpdateBookCommand } from './update-book.command';

export const BookCommandHandlers = [UpdateBookCommand, DeleteBookCommand, CreateBookCommand];

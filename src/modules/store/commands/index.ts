import { BookshelfAddBookCommandHandler } from './bookshelf-add-book.command';
import { CreateStoreCommandHandler } from './create-store.command';
import { DeleteStoreBookCommandHandler } from './delete-store-book.command';
import { DeleteStoreCommandHandler } from './delete-store.command';
import { UpdateStoreBookHandler } from './update-store-book.command';
import { UpdateStoreCommandHandler } from './update-store.command';

export const StoreCommandHandlers = [DeleteStoreCommandHandler, UpdateStoreCommandHandler, CreateStoreCommandHandler];

export const BookshelfCommandHandlers = [
  BookshelfAddBookCommandHandler,
  UpdateStoreBookHandler,
  DeleteStoreBookCommandHandler,
];

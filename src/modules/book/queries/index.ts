import { GetAllBookByStoreQueryHandler } from './get-all-book-by-store.query';
import { GetAllBookQueryHandler } from './get-all-book.query';
import { GetOneBookQueryHandler } from './get-one-book.query';

export const BookQueryHandlers = [GetAllBookQueryHandler, GetOneBookQueryHandler, GetAllBookByStoreQueryHandler];

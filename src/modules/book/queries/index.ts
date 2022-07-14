import { GetAllBookByCategoryQueryHandler } from './get-all-book-by-category';
import { GetAllBookByStoreQueryHandler } from './get-all-book-by-store.query';
import { GetAllBookQueryHandler } from './get-all-book.query';
import { GetBookRentCountQueryHandler } from './get-book-rentcount.query';
import { GetOneBookQueryHandler } from './get-one-book.query';
import { MapBookWithCountQueryHandler } from './map-book-with-count.query';

export const BookQueryHandlers = [
  GetAllBookQueryHandler,
  GetOneBookQueryHandler,
  GetAllBookByStoreQueryHandler,
  GetAllBookByCategoryQueryHandler,
  GetBookRentCountQueryHandler,
  MapBookWithCountQueryHandler,
];

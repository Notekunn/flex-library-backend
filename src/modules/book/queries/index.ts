import { GetAllBookByStoreQueryHandler } from './get-all-book-by-store.query';
import { GetAllBookCopyQueryHandler } from './get-all-book-copy.query';
import { GetAllBookQueryHandler } from './get-all-book.query';
import { GetOneBookCopyByBarcodeQueryHandler } from './get-one-book-copy-by-barcode.query';
import { GetOneBookQueryHandler } from './get-one-book.query';

export const BookQueryHandlers = [GetAllBookQueryHandler, GetOneBookQueryHandler, GetAllBookByStoreQueryHandler];

export const BookCopyQueryHandlers = [GetOneBookCopyByBarcodeQueryHandler, GetAllBookCopyQueryHandler];

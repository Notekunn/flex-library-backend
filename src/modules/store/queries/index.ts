import { CheckOwnerStoreQueryHandler } from './check-owner-store.query';
import { GetAllStoreBookQueryHandler } from './get-all-store-book.query';
import { GetAllStoreQueryHandler } from './get-all-store.query';
import { GetOneStoreBookQueryHandler } from './get-one-store-book.query';
import { GetOneStoreQueryHandler } from './get-one-store.query';

export const StoreQueryHandlers = [
  GetAllStoreQueryHandler,
  GetOneStoreQueryHandler,
  GetAllStoreBookQueryHandler,
  GetOneStoreBookQueryHandler,
  CheckOwnerStoreQueryHandler,
];

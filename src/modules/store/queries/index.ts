import { CheckOwnerStoreQueryHandler } from './check-owner-store.query';
import { GetAllStoreQueryHandler } from './get-all-store.query';
import { GetOneStoreQueryHandler } from './get-one-store.query';
import { GetStoreByOwnerQueryHandler } from './get-store-by-owner.query';

export const StoreQueryHandlers = [
  GetAllStoreQueryHandler,
  GetOneStoreQueryHandler,
  CheckOwnerStoreQueryHandler,
  GetStoreByOwnerQueryHandler,
];

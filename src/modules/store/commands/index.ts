import { CreateStoreCommandHandler } from './create-store.command';
import { DeleteStoreCommandHandler } from './delete-store.command';
import { UpdateStoreCommandHandler } from './update-store.command';

export const StoreCommandHandlers = [DeleteStoreCommandHandler, UpdateStoreCommandHandler, CreateStoreCommandHandler];

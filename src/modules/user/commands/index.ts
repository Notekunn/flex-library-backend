import { ChangeRoleCommandHandler } from './change-role.command';
import { CreateUserCommandHandler } from './create-user.command';
import { DeleteUserCommandHandler } from './delete-user.command';
import { UpdateCoinCommandHandler } from './update-coin.command';
import { UpdateUserCommandHandler } from './update-user.command';

export const UserCommandHandler = [
  CreateUserCommandHandler,
  UpdateUserCommandHandler,
  DeleteUserCommandHandler,
  ChangeRoleCommandHandler,
  UpdateCoinCommandHandler,
];

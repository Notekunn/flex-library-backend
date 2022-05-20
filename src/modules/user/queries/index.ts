import { GetAllUserQueryHandler } from './get-all-user.query';
import { GetOneUserQueryHandler } from './get-one-user.query';

export const UserQueryHandler = [GetAllUserQueryHandler, GetOneUserQueryHandler];

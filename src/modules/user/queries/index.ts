import { GetAllUserQueryHandler } from './get-all-user.query';
import { GetOneUserQueryHandler } from './get-one-user.query';
import { GetUserByEmailQueryHandler } from './get-user-by-email.query';

export const UserQueryHandler = [GetAllUserQueryHandler, GetOneUserQueryHandler, GetUserByEmailQueryHandler];

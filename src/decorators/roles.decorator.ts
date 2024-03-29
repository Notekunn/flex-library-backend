import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@constants/user-role.enum';

export const ROLES_KEY = 'auth:roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

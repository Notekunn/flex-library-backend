import { SetMetadata } from '@nestjs/common';

export const PERMISSION_KEY = 'auth:permissions';

export const Permissions = (...permissions: string[]) => SetMetadata(PERMISSION_KEY, permissions);

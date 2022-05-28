import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
// import { JwtClaimsDto } from '@modules/auth/dto/jwt-claims.dto';
import { QueryBus } from '@nestjs/cqrs';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly queryBus: QueryBus) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const routePermissions = this.reflector.get<string[]>('permissions', context.getHandler());

    if (!routePermissions) return true;

    return true;

    // const user: JwtClaimsDto = context.getArgs()[0].user;

    // const permissions
    // if (permissions.includes(UserType.SuperAdmin)) return true;

    // const hasPermission = !!routePermissions.find((routePermission) => permissions.includes(routePermission));

    // return hasPermission;
  }
}

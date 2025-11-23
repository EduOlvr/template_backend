import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('keycloak-jwt') {
  handleRequest(err: any, user: any, info: any) {
    if (err) throw err;
    return user;
  }

  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}

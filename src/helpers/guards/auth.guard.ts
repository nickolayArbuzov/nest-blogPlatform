import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class BasicAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    if (request.headers?.authorization?.split(' ')[1] === new Buffer('admin:qwerty').toString('base64') && request.headers?.authorization?.split(' ')[0] === 'Basic'){
        return true;
    }

    throw new UnauthorizedException()
  }
}
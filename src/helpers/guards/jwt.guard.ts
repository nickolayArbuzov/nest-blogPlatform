import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JWTAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService
    // add authService with jwtService(verify)
  ){}
  canActivate(
    context: ExecutionContext,
  ): boolean {
    const request: Request = context.switchToHttp().getRequest();

    if (request.headers?.authorization) {
      try {
        const user = this.jwtService.verify(request.headers?.authorization?.split(' ')[1], {secret: 'secret'})
        if (user){
          request.user = {userId: user.userId, userLogin: user.userLogin}
          return true;
        }
      } catch {
        throw new UnauthorizedException()
      }
    }

    throw new UnauthorizedException()
  }
}
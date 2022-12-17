import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class CookieGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    // add authService with jwtService(verify)
  ){}
  canActivate(
    context: ExecutionContext,
  ): boolean {
    const request: Request = context.switchToHttp().getRequest();  

    if (request.cookies){
      try {
        const user = this.jwtService.verify(request.cookies.refreshToken, {secret: 'secret'})
        if (user){
          return true
        }
      } catch {
        throw new UnauthorizedException()
      }
    }
    throw new UnauthorizedException()
  }
}
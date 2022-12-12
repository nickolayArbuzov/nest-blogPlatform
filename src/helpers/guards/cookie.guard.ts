import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { LoggerRepo } from '../logger/infrastructure/logger.repo';

@Injectable()
export class CookieGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    // add authService with jwtService(verify)
    private loggerRepo: LoggerRepo,
  ){}
  canActivate(
    context: ExecutionContext,
  ): boolean {
    const request: Request = context.switchToHttp().getRequest();  
    this.loggerRepo.createLog({path: request.path, comment: '', token: request.cookies.refreshToken || 'none', date: new Date().toISOString()})
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
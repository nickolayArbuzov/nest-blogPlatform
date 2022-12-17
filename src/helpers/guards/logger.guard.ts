import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { LoggerRepo } from '../logger/infrastructure/logger.repo';

@Injectable()
export class Logger implements CanActivate {
  constructor(
    private loggerRepo: LoggerRepo
  ){}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    this.loggerRepo.createLog({path: request.path, comment: '', date: new Date().toISOString()})

    return true;
  }
}
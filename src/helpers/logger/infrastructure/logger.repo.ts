import { Injectable } from '@nestjs/common';
import { LoggerMongoose } from './logger.repositoryMongo';

@Injectable()
export class LoggerRepo {
  constructor(private loggerMongoose: LoggerMongoose) {}

  async createLog(data: any){
    return await this.loggerMongoose.createLog(data)
  }

}
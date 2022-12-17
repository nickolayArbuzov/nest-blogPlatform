import { Injectable } from '@nestjs/common';
import { LoggerMongoose } from './logger.repositoryMongo';

@Injectable()
export class LoggerRepo {
  constructor(private loggerMongoose: LoggerMongoose) {}

  async createLog(data: any){
    return await this.loggerMongoose.createLog(data)
  }

  async getLogs(){
    const logs = await this.loggerMongoose.getLogs()
    return logs.map(l => {
      return {
        path: l.path,
        comment: l.comment,
        date: l.date,
      }
    })
  }

}
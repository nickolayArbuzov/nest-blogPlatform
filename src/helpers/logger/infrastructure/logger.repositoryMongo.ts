import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { LoggerModel } from '../domain/entitites/logger.interface';

@Injectable()
export class LoggerMongoose {
  constructor(
    @Inject('LOGGER_MONGOOSE')
    private Logger: Model<LoggerModel>,
  ) {}

  async createLog(data: any){
    return await this.Logger.create(data)
  }

  async getLogs(){
    return await this.Logger.find({})
  }

}
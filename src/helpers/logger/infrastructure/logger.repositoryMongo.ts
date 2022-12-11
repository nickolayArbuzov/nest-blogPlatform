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
    console.log('data', data)
    return await this.Logger.create(data)
  }

}
import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../outerservices/database/database.module';
import { LoggerProviders } from './infrastructure/logger.providers';
import { LoggerMongoose } from './infrastructure/logger.repositoryMongo';
import { LoggerRepo } from './infrastructure/logger.repo';

@Module({
  controllers: [],
  imports: [
    DatabaseModule, 
  ],
  providers: [
    ...LoggerProviders,
    LoggerRepo,
    LoggerMongoose,
  ],
  exports: [
    LoggerRepo,
    LoggerProviders.find(v => v.provide === 'LOGGER_MONGOOSE'),
  ]
})
export class LoggerModule {}

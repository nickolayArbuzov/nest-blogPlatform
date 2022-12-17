import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../outerservices/database/database.module';
import { likesProviders } from './infrastructure/like.providers';
import { LikesRepo } from './infrastructure/like.repo';
import { LikesMongoose } from './infrastructure/like.repositoryMongo';
import { LoggerModule } from '../../helpers/logger/logger.module';

@Module({
  controllers: [],
  imports: [DatabaseModule],
  providers: [
    LoggerModule,
    ...likesProviders,
    LikesRepo,
    LikesMongoose,
  ],
  exports: [
    LikesRepo,
    likesProviders.find(v => v.provide === 'LIKE_MONGOOSE'),
  ]
})
export class LikesModule {}

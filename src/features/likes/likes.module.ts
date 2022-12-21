import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../outerservices/database/database.module';
import { likesProviders } from './infrastructure/like.providers';
import { LikesRepo } from './infrastructure/like.repo';
import { LikesMongoose } from './infrastructure/like.repositoryMongo';
import { LoggerModule } from '../../helpers/logger/logger.module';
import { LikesSQL } from './infrastructure/like.repositorySQL';

@Module({
  controllers: [],
  imports: [DatabaseModule, LoggerModule],
  providers: [
    ...likesProviders,
    LikesRepo,
    LikesMongoose,
    LikesSQL,
  ],
  exports: [
    LikesRepo,
    likesProviders.find(v => v.provide === 'LIKE_MONGOOSE'),
  ]
})
export class LikesModule {}

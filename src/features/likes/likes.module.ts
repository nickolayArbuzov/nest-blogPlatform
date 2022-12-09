import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../outerservices/database/database.module';
import { likesProviders } from './infrastructure/like.providers';
import { LikesRepo } from './infrastructure/like.repo';
import { LikesMongoose } from './infrastructure/like.repositoryMongo';

@Module({
  controllers: [],
  imports: [DatabaseModule],
  providers: [
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

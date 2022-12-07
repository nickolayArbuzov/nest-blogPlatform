import { Module, forwardRef } from '@nestjs/common';
import { DatabaseModule } from '../../outerservices/database/database.module';
import { UsersController } from './api/users.controller';
import { UsersService } from './application/users.service';
import { usersProviders } from './infrastructure/users.providers';
import { UsersRepo } from './infrastructure/users.repo';
import { UsersMongoose } from './infrastructure/users.repositoryMongoose';

@Module({
  controllers: [UsersController],
  imports: [DatabaseModule],
  providers: [
    ...usersProviders,
    UsersService,
    UsersRepo,
    UsersMongoose,
  ],
  exports: [
    UsersRepo,
    usersProviders.find(v => v.provide === 'USER_MONGOOSE'),
  ]
})
export class UsersModule {}

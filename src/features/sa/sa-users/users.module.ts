import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DatabaseModule } from '../../../outerservices/database/database.module';
import { UsersController } from './api/users.controller';
import { UsersService } from './application/users.service';
import { UserCodeIsConfirmedRule, UserLoginIsExistRule, UserMailCheckRule, UserMailIsExistRule } from './custom-validators/customValidateUser';
import { usersProviders } from './infrastructure/users.providers';
import { UsersRepo } from './infrastructure/users.repo';
import { UsersMongoose } from './infrastructure/users.repositoryMongoose';

@Module({
  controllers: [UsersController],
  imports: [DatabaseModule, CqrsModule],
  providers: [
    ...usersProviders,
    UsersService,
    UsersRepo,
    UsersMongoose,
    UserMailIsExistRule,
    UserLoginIsExistRule,
    UserCodeIsConfirmedRule,
    UserMailCheckRule,
  ],
  exports: [
    UsersRepo,
    usersProviders.find(v => v.provide === 'USER_MONGOOSE'),
  ]
})
export class UsersModule {}

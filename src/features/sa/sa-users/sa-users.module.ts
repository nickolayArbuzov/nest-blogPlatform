import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DatabaseModule } from '../../../outerservices/database/database.module';
import { UsersController } from './api/users.controller';
import { BanOneUserByIdUseCase } from './application/use-cases/BanOneUserById';
import { CreateOneUserUseCase } from './application/use-cases/CreateOneUser';
import { DeleteOneUserByIdUseCase } from './application/use-cases/DeleteOneUserById';
import { FindAllUsersUseCase } from './application/use-cases/FindAllUsers';
import { UsersService } from './application/users.service';
import { UserCodeIsConfirmedRule, UserLoginIsExistRule, UserMailCheckRule, UserMailIsExistRule } from './custom-validators/customValidateUser';
import { usersProviders } from './infrastructure/users.providers';
import { UsersRepo } from './infrastructure/users.repo';
import { UsersMongoose } from './infrastructure/users.repositoryMongoose';
import { LikesModule } from '../../likes/likes.module';

const commands = [CreateOneUserUseCase, DeleteOneUserByIdUseCase, BanOneUserByIdUseCase]
const queries = [FindAllUsersUseCase]

@Module({
  controllers: [UsersController],
  imports: [DatabaseModule, CqrsModule, LikesModule],
  providers: [
    ...usersProviders,
    UsersService,
    UsersRepo,
    UsersMongoose,
    UserMailIsExistRule,
    UserLoginIsExistRule,
    UserCodeIsConfirmedRule,
    UserMailCheckRule,
    ...commands,
    ...queries,
  ],
  exports: [
    UsersRepo,
    usersProviders.find(v => v.provide === 'USER_MONGOOSE'),
  ]
})
export class SAUsersModule {}

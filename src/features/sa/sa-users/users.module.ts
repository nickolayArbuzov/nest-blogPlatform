import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DatabaseModule } from '../../../outerservices/database/database.module';
import { UsersController } from './api/users.controller';
import { CreateOneUserUseCase } from './application/use-cases/CreateOneUser';
import { DeleteOneUserByIdUseCase } from './application/use-cases/DeleteOneUserById';
import { FindAllUsersUseCase } from './application/use-cases/FindAllUsers';
import { UsersService } from './application/users.service';
import { UserCodeIsConfirmedRule, UserLoginIsExistRule, UserMailCheckRule, UserMailIsExistRule } from './custom-validators/customValidateUser';
import { usersProviders } from './infrastructure/users.providers';
import { UsersRepo } from './infrastructure/users.repo';
import { UsersMongoose } from './infrastructure/users.repositoryMongoose';

const commands = [CreateOneUserUseCase, DeleteOneUserByIdUseCase]
const queries = [FindAllUsersUseCase]

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
    ...commands,
    ...queries,
  ],
  exports: [
    UsersRepo,
    usersProviders.find(v => v.provide === 'USER_MONGOOSE'),
  ]
})
export class UsersModule {}

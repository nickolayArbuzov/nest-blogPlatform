import { Inject, Injectable } from '@nestjs/common';
import { QueryUserDto } from '../../../helpers/constants/commonDTO/query.dto';
import { User } from '../domain/entitites/user';
import { UsersMongoose } from './users.repositoryMongoose';

@Injectable()
export class UsersRepo {
  constructor(private usersMongoose: UsersMongoose) {}

  async findAllUsers(query: QueryUserDto){
    return this.usersMongoose.findAllUsers(query)
  }

  async createOneUser(newUser: User){
    return await this.usersMongoose.createOneUser(newUser)
  }

  async deleteOneUserById(id: string){
    return await this.usersMongoose.deleteOneUserById(id)
  }
}
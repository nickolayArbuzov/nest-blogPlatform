import { Inject, Injectable } from '@nestjs/common';
import { QueryUserDto } from '../../../../helpers/constants/commonDTO/query.dto';
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

  async passwordRecovery(email: string, code: string){
    return await this.usersMongoose.passwordRecovery(email, code)
  }

  async newPassword(passwordHash: string, passwordSalt: string, recoveryCode: string){
    return await this.usersMongoose.newPassword(passwordHash, passwordSalt, recoveryCode)
  }

  async findByLoginOrEmail(loginOrEmail: string){
    return await this.usersMongoose.findByLoginOrEmail(loginOrEmail)
  }

  async findOneForCustomDecoratorByLogin(login: string) {
    return this.usersMongoose.findOneForCustomDecoratorByLogin(login)
  }

  async findOneForCustomDecoratorByEmail(email: string) {
    return this.usersMongoose.findOneForCustomDecoratorByEmail(email)
  }

  async findOneForCustomDecoratorByCode(code: string) {
    return this.usersMongoose.findOneForCustomDecoratorByCode(code)
  }

  async findOneForCustomDecoratorCheckMail(email: string) {
    return this.usersMongoose.findOneForCustomDecoratorCheckMail(email)
  }

  async registrationConfirmation(code: string){
    return this.usersMongoose.registrationConfirmation(code)
  }

  async registrationEmailResending(email: string, code: string){
    return this.usersMongoose.registrationEmailResending(email, code)
  }

  async authMe(userId: string){
    return this.usersMongoose.authMe(userId)
  }
}
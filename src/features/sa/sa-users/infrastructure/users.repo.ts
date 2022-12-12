import { Injectable } from '@nestjs/common';
import { QueryUserDto } from '../../../../helpers/constants/commonDTO/query.dto';
import { BanInfo, User } from '../domain/entitites/user';
import { UsersMongoose } from './users.repositoryMongoose';

@Injectable()
export class UsersRepo {
  constructor(private usersMongoose: UsersMongoose) {}

  async banOneUserById(id: string, banInfo: BanInfo){
    return await this.usersMongoose.banOneUserById(id, banInfo)
  }

  async findAllUsers(query: QueryUserDto){
    return await this.usersMongoose.findAllUsers(query)
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
    return await this.usersMongoose.findOneForCustomDecoratorByLogin(login)
  }

  async findOneForCustomDecoratorByEmail(email: string) {
    return await this.usersMongoose.findOneForCustomDecoratorByEmail(email)
  }

  async findOneForCustomDecoratorByCode(code: string) {
    return await this.usersMongoose.findOneForCustomDecoratorByCode(code)
  }

  async findOneForCustomDecoratorCheckMail(email: string) {
    return await this.usersMongoose.findOneForCustomDecoratorCheckMail(email)
  }

  async registrationConfirmation(code: string){
    return await this.usersMongoose.registrationConfirmation(code)
  }

  async registrationEmailResending(email: string, code: string){
    return await this.usersMongoose.registrationEmailResending(email, code)
  }

  async authMe(userId: string){
    return this.usersMongoose.authMe(userId)
  }
}
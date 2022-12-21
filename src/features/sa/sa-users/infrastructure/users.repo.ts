import { Injectable } from '@nestjs/common';
import { QueryUserDto } from '../../../../helpers/constants/commonDTO/query.dto';
import { BanInfo, User } from '../domain/entitites/user';
import { UsersMongoose } from './users.repositoryMongoose';
import { UsersSQL } from './users.repositorySQL';

@Injectable()
export class UsersRepo {
  constructor(
    private usersRepo: UsersSQL
  ) {}

  async banOneUserById(id: string, banInfo: BanInfo){
    return await this.usersRepo.banOneUserById(id, banInfo)
  }

  async findAllUsers(query: QueryUserDto){
    return await this.usersRepo.findAllUsers(query)
  }

  async createOneUser(newUser: User){
    return await this.usersRepo.createOneUser(newUser)
  }

  async deleteOneUserById(id: string){
    return await this.usersRepo.deleteOneUserById(id)
  }

  async passwordRecovery(email: string, code: string){
    return await this.usersRepo.passwordRecovery(email, code)
  }

  async newPassword(passwordHash: string, passwordSalt: string, recoveryCode: string){
    return await this.usersRepo.newPassword(passwordHash, passwordSalt, recoveryCode)
  }

  async findByLoginOrEmail(loginOrEmail: string){
    return await this.usersRepo.findByLoginOrEmail(loginOrEmail)
  }

  async findOneUserById(userId: string){
    return await this.usersRepo.findOneUserById(userId)
  }

  async findOneForCustomDecoratorByLogin(login: string) {
    return await this.usersRepo.findOneForCustomDecoratorByLogin(login)
  }

  async findOneForCustomDecoratorByEmail(email: string) {
    return await this.usersRepo.findOneForCustomDecoratorByEmail(email)
  }

  async findOneForCustomDecoratorByCode(code: string) {
    return await this.usersRepo.findOneForCustomDecoratorByCode(code)
  }

  async findOneForCustomDecoratorCheckMail(email: string) {
    return await this.usersRepo.findOneForCustomDecoratorCheckMail(email)
  }

  async registrationConfirmation(code: string){
    return await this.usersRepo.registrationConfirmation(code)
  }

  async registrationEmailResending(email: string, code: string){
    return await this.usersRepo.registrationEmailResending(email, code)
  }

  async authMe(userId: string){
    return this.usersRepo.authMe(userId)
  }
}
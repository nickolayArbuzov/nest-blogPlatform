import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { QueryUserDto } from '../../../../helpers/constants/commonDTO/query.dto';
import { BanInfo, User } from '../domain/entitites/user';
import { UserModel } from '../domain/entitites/user.interface';

@Injectable()
export class UsersMongoose {
  constructor(
    @Inject('USER_MONGOOSE')
    private User: Model<UserModel>,
  ) {}

  async banOneUserById(id: string, banInfo: BanInfo){
    return await this.User.updateOne({_id: id}, {$set: {banInfo: banInfo}})
  }

  async findAllUsers(query: QueryUserDto){
    const users = await this.User.find(
        {$or: [
            {"login": {$regex: query.searchLoginTerm, $options: 'i'}}, 
            {"email": {$regex: query.searchEmailTerm, $options: 'i'}}
        ]}
    )
    .skip((+query.pageNumber - 1) * +query.pageSize)
    .limit(+query.pageSize)
    .sort({[query.sortBy] : query.sortDirection})
   
    const totalCount = await this.User.countDocuments(
        {$or: [
            {"login": {$regex: query.searchLoginTerm, $options: 'i'}}, 
            {"email": {$regex: query.searchEmailTerm, $options: 'i'}}
        ]}
    )

    return {    
        pagesCount: Math.ceil(totalCount/+query.pageSize),
        page: +query.pageNumber,
        pageSize: +query.pageSize,
        totalCount: totalCount,
        items: users.map(i => {
            return {
              id: i._id, 
              login: i.login, 
              email: i.email,
              createdAt: i.createdAt,
              banInfo: i.banInfo,
            }
        }),
    }
  }

  async createOneUser(newUser: User){
    return await this.User.create(newUser)
  }

  async deleteOneUserById(id: string){
    return await this.User.deleteOne({_id: id})
  }

  async passwordRecovery(email: string, code: string){
    const user = await this.User.updateOne({email: email}, {$set: {code: code}})
    return user.matchedCount === 1
  }

  async newPassword(passwordHash: string, passwordSalt: string, recoveryCode: string){
    await this.User.updateOne({code: recoveryCode}, {$set: {passwordHash: passwordHash, passwordSalt: passwordSalt, isActivated: true}})
  }

  async findByLoginOrEmail(loginOrEmail: string){
    return await this.User.findOne(
      {$or: [
          {"login": loginOrEmail},
          {"email": loginOrEmail}
      ]}
    )
  }

  async findOneForCustomDecoratorByLogin(login: string) {
    const user = await this.User.findOne({login: login})
    if(user) {
      return user
    } else {
      return null
    }
  }

  async findOneForCustomDecoratorByEmail(email: string) {
    const user = await this.User.findOne({email: email})
    if(user) {
      return user
    } else {
      return null
    }
  }

  async findOneForCustomDecoratorByCode(code: string) {
    const user = await this.User.findOne({code: code})
    if(user && user.isActivated !== true) {
      return user
    } else {
      return null
    }
  }

  async findOneForCustomDecoratorCheckMail(email: string) {
    const user = await this.User.findOne({email: email})
    if(user && user.isActivated !== true) {
      return user
    } else {
      return null
    }
  }

  async registrationConfirmation(code: string) {
    return await this.User.updateOne({code: code}, {$set: {isActivated: true}})
  }

  async registrationEmailResending(email: string, code: string){
    return await this.User.updateOne({email: email}, {$set: {code: code}})
  }

  async authMe(userId: string){
    return await this.User.findOne({id: userId})
  }
}
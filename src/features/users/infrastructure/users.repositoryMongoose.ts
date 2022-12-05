import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { QueryUserDto } from '../../../helpers/constants/commonDTO/query.dto';
import { User } from '../domain/entitites/user';
import { UserModel } from '../domain/entitites/user.interface';

@Injectable()
export class UsersMongoose {
  constructor(
    @Inject('USER_MONGOOSE')
    private User: Model<UserModel>,
  ) {}

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
}
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { queryDefault } from '../../../helpers/constants/constants/constants';
import { QueryUserDto } from '../../../helpers/constants/commonDTO/query.dto';
import { CreateUserDto } from '../dto/user.dto';
import { UsersRepo } from '../infrastructure/users.repo';

@Injectable()
export class UsersService {
  constructor(private usersRepo: UsersRepo) {}

    async findAllUsers(queryParams: QueryUserDto){
      const query = {
        pageNumber: queryParams.pageNumber || queryDefault.pageNumber,
        pageSize: queryParams.pageSize || queryDefault.pageSize,
        sortBy: queryParams.sortBy || queryDefault.sortBy,
        sortDirection: queryParams.sortDirection === 'asc' ? queryParams.sortDirection : queryDefault.sortDirection,
        searchEmailTerm: queryParams.searchEmailTerm || '',
        searchLoginTerm: queryParams.searchLoginTerm || '',
      }

      return this.usersRepo.findAllUsers(query)
    }

    async createOneUser(newUser: CreateUserDto){
      const date = new Date()
      const user = {
        login: newUser.login,
        email: newUser.email,
        password: newUser.password,
        createdAt: date.toISOString(),
      }

      const createdUser = await this.usersRepo.createOneUser(user)

      return {
        id: createdUser._id,
        login: createdUser.login,
        email: createdUser.email,
        createdAt: createdUser.createdAt,
      }
    }

    async deleteOneUserById(id: string){
        const user = await this.usersRepo.deleteOneUserById(id)
        if(user.deletedCount === 0){
          throw new HttpException('User not found', HttpStatus.NOT_FOUND)
        } else {
          return
        }
    }
}
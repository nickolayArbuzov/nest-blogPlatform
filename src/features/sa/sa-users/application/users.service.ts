import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { queryDefault } from '../../../../helpers/constants/constants/constants';
import { QueryUserDto } from '../../../../helpers/constants/commonDTO/query.dto';
import { BanDto, CreateUserDto } from '../dto/user.dto';
import { UsersRepo } from '../infrastructure/users.repo';

@Injectable()
export class UsersService {
  constructor(
    private usersRepo: UsersRepo
  ) {}

    async banOneUserById(id: string, banDto: BanDto){
      const date = new Date()
      const banInfo = {
        isBanned: banDto.isBanned,
        banDate: date.toISOString(),
        banReason: banDto.banReason,
      }
      return await this.usersRepo.banOneUserById(id, banInfo)
    }

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

      const passwordSalt = await bcrypt.genSalt(8)
      const passwordHash = await bcrypt.hash(newUser.password, passwordSalt)

      const date = new Date()
      const user = {
        login: newUser.login,
        email: newUser.email,
        passwordHash: passwordHash,
        passwordSalt: passwordSalt,
        isActivated: false,
        code: '',
        createdAt: date.toISOString(),
        banInfo: {
          isBanned: false,
          banDate: date.toISOString(),
          banReason: "",
        },
      }

      const createdUser = await this.usersRepo.createOneUser(user)

      return {
        id: createdUser._id,
        login: createdUser.login,
        email: createdUser.email,
        createdAt: createdUser.createdAt,
        banInfo: createdUser.banInfo,
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

    async findOneForCustomDecoratorByLogin(login: string) {
      return this.usersRepo.findOneForCustomDecoratorByLogin(login)
    }
  
    async findOneForCustomDecoratorByEmail(email: string) {
      return this.usersRepo.findOneForCustomDecoratorByEmail(email)
    }
  
    async findOneForCustomDecoratorByCode(code: string) {
      return this.usersRepo.findOneForCustomDecoratorByCode(code)
    }
  
    async findOneForCustomDecoratorCheckMail(email: string) {
      return this.usersRepo.findOneForCustomDecoratorCheckMail(email)
    }
}
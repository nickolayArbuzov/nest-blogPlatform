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
import { Injectable } from '@nestjs/common';
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
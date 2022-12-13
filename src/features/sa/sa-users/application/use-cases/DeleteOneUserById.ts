import { HttpException, HttpStatus } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { UsersRepo } from '../../infrastructure/users.repo';

export class DeleteOneUserByIdCommand {
  constructor(
    public id: string
  ) {}
}

@CommandHandler(DeleteOneUserByIdCommand)
export class DeleteOneUserByIdUseCase {
  constructor(
    private usersRepo: UsersRepo,
  ) {}

    async execute(command: DeleteOneUserByIdCommand){
        const user = await this.usersRepo.deleteOneUserById(command.id)
        if(user.deletedCount === 0){
          throw new HttpException('User not found', HttpStatus.NOT_FOUND)
        } else {
          return
        }
    }
}
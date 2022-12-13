import { HttpException, HttpStatus } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { BanDto } from '../../dto/user.dto';
import { UsersRepo } from '../../infrastructure/users.repo';

export class BanOneUserByIdCommand {
  constructor(
    public id: string,
    public banDto: BanDto,
  ) {}
}

@CommandHandler(BanOneUserByIdCommand)
export class BanOneUserByIdUseCase {
  constructor(
    private usersRepo: UsersRepo,
  ) {}

    async execute(command: BanOneUserByIdCommand){
        const date = new Date()
        const banInfo = {
            isBanned: command.banDto.isBanned,
            banDate: date.toISOString(),
            banReason: command.banDto.banReason,
        }
        return await this.usersRepo.banOneUserById(command.id, banInfo)
    }
}
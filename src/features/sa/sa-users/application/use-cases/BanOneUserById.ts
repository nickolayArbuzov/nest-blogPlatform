import { HttpException, HttpStatus } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { LikesRepo } from '../../../../likes/infrastructure/like.repo';
import { BanDto } from '../../dto/user.dto';
import { UsersRepo } from '../../infrastructure/users.repo';

export class BanOneUserByIdCommand {
  constructor(
    public userId: string,
    public banDto: BanDto,
  ) {}
}

@CommandHandler(BanOneUserByIdCommand)
export class BanOneUserByIdUseCase {
  constructor(
    private usersRepo: UsersRepo,
    private likesRepo: LikesRepo,
  ) {}

  async execute(command: BanOneUserByIdCommand){
    const date = new Date()
    const banInfo = {
      isBanned: command.banDto.isBanned,
      banDate: command.banDto.isBanned ? date.toISOString() : null,
      banReason: command.banDto.isBanned ? command.banDto.banReason : null,
    }
    await this.likesRepo.updateBannedStatusInLikes(command.userId, command.banDto.isBanned)
    return await this.usersRepo.banOneUserById(command.userId, banInfo)
  }
}
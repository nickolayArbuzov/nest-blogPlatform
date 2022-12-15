import { CommandHandler } from '@nestjs/cqrs';
import { BanUserDto } from '../../../../../shared/dto/ban.dto';
import { LikesRepo } from '../../../../likes/infrastructure/like.repo';
import { UsersRepo } from '../../infrastructure/users.repo';

export class BanOneUserByIdCommand {
  constructor(
    public userId: string,
    public banUserDto: BanUserDto,
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
      isBanned: command.banUserDto.isBanned,
      banDate: command.banUserDto.isBanned ? date.toISOString() : null,
      banReason: command.banUserDto.isBanned ? command.banUserDto.banReason : null,
    }
    await this.likesRepo.updateBannedStatusInLikes(command.userId, command.banUserDto.isBanned)
    return await this.usersRepo.banOneUserById(command.userId, banInfo)
  }
}
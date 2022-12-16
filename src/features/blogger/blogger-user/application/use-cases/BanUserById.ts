import { CommandHandler } from '@nestjs/cqrs';
import { BanUserBlogDto } from '../../../../../shared/dto/ban.dto';
import { BloggerUserRepo } from '../../infrastructure/blogger-user.repo';

export class BanUserByIdCommand {
  constructor(
    public userId: string,
    public banUserBlogDto: BanUserBlogDto,
  ) {}
}

@CommandHandler(BanUserByIdCommand)
export class BanUserByIdUseCase {
  constructor(
    private bloggerUserRepo: BloggerUserRepo,
  ) {}

  async execute(command: BanUserByIdCommand){
    return await this.bloggerUserRepo.banUserById(command.userId, command.banUserBlogDto)
  }
}
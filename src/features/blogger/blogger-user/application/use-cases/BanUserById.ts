import { CommandHandler } from '@nestjs/cqrs';
import { UsersRepo } from '../../../../sa/sa-users/infrastructure/users.repo';
import { BanUserBlogDto } from '../../../../../shared/dto/ban.dto';
import { BloggerUserRepo } from '../../infrastructure/blogger-user.repo';
import { HttpException, HttpStatus } from '@nestjs/common';
import { BloggerRepo } from '../../../../blogger/blogger-blog/infrastructure/blogger.repo';

export class BanUserByIdCommand {
  constructor(
    public userId: string,
    public banUserBlogDto: BanUserBlogDto,
    public ownerId: string,
  ) {}
}

@CommandHandler(BanUserByIdCommand)
export class BanUserByIdUseCase {
  constructor(
    private bloggerUserRepo: BloggerUserRepo,
    private usersRepo: UsersRepo,
    private bloggerRepo: BloggerRepo,
  ) {}

  async execute(command: BanUserByIdCommand){
    const user = await this.usersRepo.findOneUserById(command.userId)
    if(!user || command.userId === command.ownerId){
      throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    }
    const blog = await this.bloggerRepo.findOneBlogById(command.banUserBlogDto.blogId)
    if(!blog){
      throw new HttpException('Blog not found', HttpStatus.NOT_FOUND)
    }
    if(blog.blogOwnerInfo.userId !== command.ownerId){
      throw new HttpException('Blog not your', HttpStatus.FORBIDDEN)
    }
    return await this.bloggerUserRepo.banUserById(command.userId, command.banUserBlogDto)
  }
}
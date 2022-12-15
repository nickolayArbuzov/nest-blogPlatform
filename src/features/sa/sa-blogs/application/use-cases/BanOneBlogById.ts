import { CommandHandler } from '@nestjs/cqrs';
import { BanBlogDto } from '../../../../../shared/dto/ban.dto';
import { BlogsRepo } from '../../infrastructure/blogs.repo';

export class BanOneBlogByIdCommand {
  constructor(
    public blogId: string, 
    public banBlogDto: BanBlogDto
  ) {}
}

@CommandHandler(BanOneBlogByIdCommand)
export class BanOneBlogByIdUseCase {
  constructor(
    private blogsRepo: BlogsRepo,
  ) {}

  async execute(command: BanOneBlogByIdCommand){
    
  }
}
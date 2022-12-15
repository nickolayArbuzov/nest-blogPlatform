import { CommandHandler } from '@nestjs/cqrs';
import { BloggerRepo } from '../../infrastructure/blogger.repo';

export class FindAllCommentsForUsersBlogsQuery {
  constructor(
    public userId: string,
  ) {}
}

@CommandHandler(FindAllCommentsForUsersBlogsQuery)
export class FindAllCommentsForUsersBlogsUseCase {
  constructor(
    private bloggerRepo: BloggerRepo,
  ) {}

  async execute(command: FindAllCommentsForUsersBlogsQuery){
    return 
  }
}
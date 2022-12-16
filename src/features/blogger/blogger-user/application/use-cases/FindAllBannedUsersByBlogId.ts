import { QueryHandler } from '@nestjs/cqrs';
import { BloggerUserRepo } from '../../infrastructure/blogger-user.repo';
import { QueryBlogDto } from '../../../../../helpers/constants/commonDTO/query.dto';
import { queryDefault } from '../../../../../helpers/constants/constants/constants';

export class FindAllBannedUsersByBlogIdQuery {
  constructor(
    public blogId: string
  ) {}
}

@QueryHandler(FindAllBannedUsersByBlogIdQuery)
export class FindAllBannedUsersByBlogIdUseCase {
  constructor(
    private bloggerUserRepo: BloggerUserRepo,
  ) {}

  async execute(command: FindAllBannedUsersByBlogIdQuery){
    return await this.bloggerUserRepo.findAllBannedUsersByBlogId(command.blogId)
  }
}
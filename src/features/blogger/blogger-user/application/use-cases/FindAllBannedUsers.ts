import { QueryHandler } from '@nestjs/cqrs';
import { BloggerRepo } from '../../infrastructure/blogger.repo';
import { QueryBlogDto } from '../../../../../helpers/constants/commonDTO/query.dto';
import { queryDefault } from '../../../../../helpers/constants/constants/constants';

export class FindAllBannedUsersQuery {
  constructor(

  ) {}
}

@QueryHandler(FindAllBannedUsersQuery)
export class FindAllBannedUsersUseCase {
  constructor(
    private bloggerRepo: BloggerRepo,
  ) {}

  async execute(){
    return
  }
}
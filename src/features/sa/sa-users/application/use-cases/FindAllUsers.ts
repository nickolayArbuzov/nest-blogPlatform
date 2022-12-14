import { queryDefault } from '../../../../../helpers/constants/constants/constants';
import { QueryUserDto } from '../../../../../helpers/constants/commonDTO/query.dto';
import { UsersRepo } from '../../infrastructure/users.repo';
import { QueryHandler } from '@nestjs/cqrs';

export class FindAllUsersQuery {
  constructor(
    public query: QueryUserDto
  ) {}
}

@QueryHandler(FindAllUsersQuery)
export class FindAllUsersUseCase {
  constructor(
    private usersRepo: UsersRepo,
  ) {}

    async execute(query: FindAllUsersQuery){
      const queryParams = {
        banStatus: query.query.banStatus || 'all',
        pageNumber: query.query.pageNumber || queryDefault.pageNumber,
        pageSize: query.query.pageSize || queryDefault.pageSize,
        sortBy: query.query.sortBy || queryDefault.sortBy,
        sortDirection: query.query.sortDirection === 'asc' ? query.query.sortDirection : queryDefault.sortDirection,
        searchEmailTerm: query.query.searchEmailTerm || '',
        searchLoginTerm: query.query.searchLoginTerm || '',
      }

      return this.usersRepo.findAllUsers(queryParams)
    }

}
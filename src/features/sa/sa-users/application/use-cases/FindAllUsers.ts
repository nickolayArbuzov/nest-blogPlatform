import { queryDefault } from '../../../../../helpers/constants/constants/constants';
import { QueryUserDto } from '../../../../../helpers/constants/commonDTO/query.dto';
import { UsersRepo } from '../../infrastructure/users.repo';
import { QueryHandler } from '@nestjs/cqrs';

export class FindAllUsersQuery {
  constructor(
    public message: QueryUserDto
  ) {}
}

@QueryHandler(FindAllUsersQuery)
export class FindAllUsersUseCase {
  constructor(
    private usersRepo: UsersRepo,
  ) {}

    async execute(query: FindAllUsersQuery){
      const queryParams = {
        pageNumber: query.message.pageNumber || queryDefault.pageNumber,
        pageSize: query.message.pageSize || queryDefault.pageSize,
        sortBy: query.message.sortBy || queryDefault.sortBy,
        sortDirection: query.message.sortDirection === 'asc' ? query.message.sortDirection : queryDefault.sortDirection,
        searchEmailTerm: query.message.searchEmailTerm || '',
        searchLoginTerm: query.message.searchLoginTerm || '',
      }

      return this.usersRepo.findAllUsers(queryParams)
    }

}
import { queryDefault } from '../../../../helpers/constants/constants/constants';
import { QueryUserDto } from '../../../../helpers/constants/commonDTO/query.dto';
import { UsersRepo } from '../../infrastructure/users.repo';
import { CommandHandler } from '@nestjs/cqrs';

export class FindAllUsersCommand {
  constructor(
    public message: QueryUserDto
  ) {}
}

@CommandHandler(FindAllUsersCommand)
export class FindAllUsersUseCase {
  constructor(
    private usersRepo: UsersRepo,
  ) {}

    async execute(command: FindAllUsersCommand){
      const query = {
        pageNumber: command.message.pageNumber || queryDefault.pageNumber,
        pageSize: command.message.pageSize || queryDefault.pageSize,
        sortBy: command.message.sortBy || queryDefault.sortBy,
        sortDirection: command.message.sortDirection === 'asc' ? command.message.sortDirection : queryDefault.sortDirection,
        searchEmailTerm: command.message.searchEmailTerm || '',
        searchLoginTerm: command.message.searchLoginTerm || '',
      }

      return this.usersRepo.findAllUsers(query)
    }

}
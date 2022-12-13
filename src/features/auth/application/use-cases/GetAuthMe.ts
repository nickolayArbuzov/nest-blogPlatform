import { QueryHandler } from '@nestjs/cqrs';
import { UsersRepo } from '../../../sa/sa-users/infrastructure/users.repo';

export class GetAuthMeQuery {
  constructor(
    public userId: string,
  ) {}
}

@QueryHandler(GetAuthMeQuery)
export class GetAuthMeUseCase {
  constructor(
    private usersRepo: UsersRepo,
  ) {}

  async execute(query: GetAuthMeQuery){
    const user = await this.usersRepo.authMe(query.userId)
    return {
      email: user.email,
      login: user.login,
      userId: user.id,
    }
  }
}
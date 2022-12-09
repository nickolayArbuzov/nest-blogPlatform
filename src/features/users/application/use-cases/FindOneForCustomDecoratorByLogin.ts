import { CommandHandler } from '@nestjs/cqrs';
import { UsersRepo } from '../../infrastructure/users.repo';

export class FindOneForCustomDecoratorByLoginCommand {
  constructor(
    public message: string
  ) {}
}

@CommandHandler(FindOneForCustomDecoratorByLoginCommand)
export class FindOneForCustomDecoratorByLoginUseCase {
  constructor(
    private usersRepo: UsersRepo,
  ) {}

    async execute(command: FindOneForCustomDecoratorByLoginCommand) {
      return this.usersRepo.findOneForCustomDecoratorByLogin(command.message)
    }
  
}
import { CommandHandler } from '@nestjs/cqrs';
import { UsersRepo } from '../../infrastructure/users.repo';

export class FindOneForCustomDecoratorByCodeCommand {
  constructor(
    public message: string
  ) {}
}

@CommandHandler(FindOneForCustomDecoratorByCodeCommand)
export class FindOneForCustomDecoratorByCodeUseCase {
  constructor(
    private usersRepo: UsersRepo,
  ) {}

    async execute(command: FindOneForCustomDecoratorByCodeCommand) {
      return this.usersRepo.findOneForCustomDecoratorByCode(command.message)
    }
}
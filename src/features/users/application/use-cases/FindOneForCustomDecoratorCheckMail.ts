import { CommandHandler } from '@nestjs/cqrs';
import { UsersRepo } from '../../infrastructure/users.repo';

export class FindOneForCustomDecoratorCheckMailCommand {
  constructor(
    public message: string
  ) {}
}

@CommandHandler(FindOneForCustomDecoratorCheckMailCommand)
export class FindOneForCustomDecoratorCheckMailUseCase {
  constructor(
    private usersRepo: UsersRepo,
  ) {}
  
    async execute(command: FindOneForCustomDecoratorCheckMailCommand) {
      return this.usersRepo.findOneForCustomDecoratorCheckMail(command.message)
    }
}
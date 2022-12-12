import { CommandHandler } from '@nestjs/cqrs';
import { UsersRepo } from '../../infrastructure/users.repo';

export class FindOneForCustomDecoratorByEmailCommand {
  constructor(
    public message: string
  ) {}
}

@CommandHandler(FindOneForCustomDecoratorByEmailCommand)
export class FindOneForCustomDecoratorByEmailUseCase {
  constructor(
    private usersRepo: UsersRepo,
  ) {}
  
    async execute(command: FindOneForCustomDecoratorByEmailCommand) {
      return this.usersRepo.findOneForCustomDecoratorByEmail(command.message)
    }

}
import { CommandHandler } from '@nestjs/cqrs';
import { RegistrationConfirmationDto } from '../../dto/auth.dto';
import { UsersRepo } from '../../../sa/sa-users/infrastructure/users.repo';

export class RegistrationConfirmationCommand {
  constructor(
    public dto: RegistrationConfirmationDto,
  ) {}
}

@CommandHandler(RegistrationConfirmationCommand)
export class RegistrationConfirmationUseCase {
  constructor(
    private usersRepo: UsersRepo,
  ) {}

  async execute(command: RegistrationConfirmationCommand){
    return await this.usersRepo.registrationConfirmation(command.dto.code)
  }
}
import {v4} from 'uuid';
import { CommandHandler } from '@nestjs/cqrs';
import { sendEmail } from '../../../../adapters/mail.adapter';
import { UsersRepo } from '../../../sa/sa-users/infrastructure/users.repo';
import { RegistrationEmailResendingDto } from '../../dto/auth.dto';

export class RegistrationEmailResendingCommand {
  constructor(
    public dto: RegistrationEmailResendingDto,
  ) {}
}

@CommandHandler(RegistrationEmailResendingCommand)
export class RegistrationEmailResendingUseCase {
  constructor(
    private usersRepo: UsersRepo,
  ) {}

  async execute(command: RegistrationEmailResendingCommand){
    const code = v4()
    await this.usersRepo.registrationEmailResending(command.dto.email, code)
    await sendEmail(command.dto.email, code, 'confirm-registration?code')
    return true
  }
}
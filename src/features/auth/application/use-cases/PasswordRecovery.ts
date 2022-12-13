import { CommandHandler } from '@nestjs/cqrs';
import {v4} from 'uuid';
import { sendEmail } from '../../../../adapters/mail.adapter';
import { PasswordRecoveryDto } from '../../dto/auth.dto';
import { UsersRepo } from '../../../sa/sa-users/infrastructure/users.repo';

export class PasswordRecoveryCommand {
  constructor(
    public passwordRecoveryDto: PasswordRecoveryDto,
  ) {}
}

@CommandHandler(PasswordRecoveryCommand)
export class PasswordRecoveryUseCase {
  constructor(
    private usersRepo: UsersRepo,
  ) {}

    async execute(command: PasswordRecoveryCommand){
      const code = v4()
      await this.usersRepo.passwordRecovery(command.passwordRecoveryDto.email, code)
      await sendEmail(command.passwordRecoveryDto.email, code, 'password-recovery?recoveryCode')
      return
    }
}
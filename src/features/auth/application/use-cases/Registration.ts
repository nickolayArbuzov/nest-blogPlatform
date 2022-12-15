import { CommandHandler } from '@nestjs/cqrs';
import * as bcrypt from 'bcrypt';
import {v4} from 'uuid';
import { sendEmail } from '../../../../adapters/mail.adapter';
import { RegistrationDto } from '../../dto/auth.dto';
import { UsersRepo } from '../../../sa/sa-users/infrastructure/users.repo';

export class RegistrationCommand {
  constructor(
    public newUser: RegistrationDto,
  ) {}
}

@CommandHandler(RegistrationCommand)
export class RegistrationUseCase {
  constructor(
    private usersRepo: UsersRepo,
  ) {}

    async execute(command: RegistrationCommand){
      const passwordSalt = await bcrypt.genSalt(8)
      const passwordHash = await bcrypt.hash(command.newUser.password, passwordSalt)
      const code = v4()

      const date = new Date()
      const user = {
        login: command.newUser.login,
        email: command.newUser.email,
        passwordHash: passwordHash,
        passwordSalt: passwordSalt,
        isActivated: false,
        code: code,
        createdAt: date.toISOString(),
        banInfo: {
          isBanned: false,
          banDate: null,
          banReason: null,
        },
      }

      await this.usersRepo.createOneUser(user)
      await sendEmail(command.newUser.email, code, 'confirm-email?code')
    }
}
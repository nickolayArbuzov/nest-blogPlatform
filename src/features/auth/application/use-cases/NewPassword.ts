import { CommandHandler } from '@nestjs/cqrs';
import * as bcrypt from 'bcrypt';
import { NewPasswordDto } from '../../dto/auth.dto';
import { UsersRepo } from '../../../sa/sa-users/infrastructure/users.repo';

export class NewPasswordCommand {
  constructor(
    public newPasswordDto: NewPasswordDto,
  ) {}
}

@CommandHandler(NewPasswordCommand)
export class NewPasswordUseCase {
  constructor(
    private usersRepo: UsersRepo,
  ) {}

  async execute(command: NewPasswordCommand){
    const passwordSalt = await bcrypt.genSalt(8)
    const passwordHash = await bcrypt.hash(command.newPasswordDto.newPassword, passwordSalt)
    return await this.usersRepo.newPassword(passwordHash, passwordSalt, command.newPasswordDto.recoveryCode)
  }
}
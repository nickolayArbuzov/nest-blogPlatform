import { CommandHandler } from '@nestjs/cqrs';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../../dto/user.dto';
import { UsersRepo } from '../../infrastructure/users.repo';

export class CreateOneUserCommand {
  constructor(
    public userDto: CreateUserDto
  ) {}
}

@CommandHandler(CreateOneUserCommand)
export class CreateOneUserUseCase {
  constructor(
    private usersRepo: UsersRepo,
  ) {}

    async execute(command: CreateOneUserCommand){

      const passwordSalt = await bcrypt.genSalt(8)
      const passwordHash = await bcrypt.hash(command.userDto.password, passwordSalt)

      const date = new Date()
      const user = {
        login: command.userDto.login,
        email: command.userDto.email,
        passwordHash: passwordHash,
        passwordSalt: passwordSalt,
        isActivated: false,
        code: '',
        createdAt: date.toISOString(),
        banInfo: {
          isBanned: false,
          banDate: null,
          banReason: null,
        },
      }

      const createdUser = await this.usersRepo.createOneUser(user)

      return {
        id: createdUser._id,
        login: createdUser.login,
        email: createdUser.email,
        createdAt: createdUser.createdAt,
        banInfo: createdUser.banInfo,
      }
    }
}
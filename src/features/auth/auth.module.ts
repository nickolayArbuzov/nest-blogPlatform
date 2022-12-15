import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { LoggerModule } from '../../helpers/logger/logger.module';
import { DevicesModule } from '../devices/devices.module';
import { SAUsersModule } from '../sa/sa-users/sa-users.module';
import { AuthController } from './api/auth.controller';
import { AuthService } from './application/auth.service';
import { GetAuthMeUseCase } from './application/use-cases/GetAuthMe';
import { LoginUseCase } from './application/use-cases/Login';
import { LogoutUseCase } from './application/use-cases/Logout';
import { NewPasswordUseCase } from './application/use-cases/NewPassword';
import { PasswordRecoveryUseCase } from './application/use-cases/PasswordRecovery';
import { RefreshTokensUseCase } from './application/use-cases/RefreshTokens';
import { RegistrationUseCase } from './application/use-cases/Registration';
import { RegistrationConfirmationUseCase } from './application/use-cases/RegistrationConfirmation';
import { RegistrationEmailResendingUseCase } from './application/use-cases/RegistrationEmailResending';

const commands = [
  PasswordRecoveryUseCase, NewPasswordUseCase, LoginUseCase, RefreshTokensUseCase, RegistrationConfirmationUseCase, 
  RegistrationUseCase, RegistrationEmailResendingUseCase, LogoutUseCase
]
const queries = [GetAuthMeUseCase]

@Module({
  controllers: [AuthController],
  imports: [
    LoggerModule,
    SAUsersModule,
    DevicesModule,
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'secret',
    }),
    CqrsModule,
  ],
  providers: [
    AuthService, 
    ...commands,
    ...queries,
  ],
  exports: [JwtModule]
})
export class AuthModule {}

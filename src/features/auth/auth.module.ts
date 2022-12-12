import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { LoggerModule } from '../../helpers/logger/logger.module';
import { DevicesModule } from '../devices/devices.module';
import { UsersModule } from '../sa/sa-users/users.module';
import { AuthController } from './api/auth.controller';
import { AuthService } from './application/auth.service';

@Module({
  controllers: [AuthController],
  imports: [
    LoggerModule,
    UsersModule,
    DevicesModule,
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'secret',
    })
  ],
  providers: [
    AuthService, 
  ],
  exports: [JwtModule]
})
export class AuthModule {}

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { DevicesModule } from '../devices/devices.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './api/auth.controller';
import { AuthService } from './application/auth.service';

@Module({
  controllers: [AuthController],
  imports: [
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

import { HttpException, HttpStatus } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { DevicesRepo } from '../../../devices/infrastructure/devices.repo';

export class RefreshTokensCommand {
  constructor(
    public refreshToken: string,
  ) {}
}

@CommandHandler(RefreshTokensCommand)
export class RefreshTokensUseCase {
  constructor(
    private devicesRepo: DevicesRepo,
    private readonly jwtService: JwtService,
  ) {}

    async execute(command: RefreshTokensCommand){
      try{
        const refresh = this.jwtService.verify(command.refreshToken, {secret: 'secret'});
        const device = await this.devicesRepo.findOneDeviceByRefreshTokenData(refresh.deviceId, refresh.issuedAt)
        if(device) {
          const issuedAt = new Date().getTime()
          const expiresAt = new Date().getTime() + 600000
          const payloadAccess = {userId: device.userId, deviceId: device.deviceId, issuedAt: issuedAt}
          const payloadRefresh = {userId: device.userId, deviceId: device.deviceId, issuedAt: issuedAt}
          const accessToken = this.jwtService.sign(payloadAccess, {expiresIn: '5m'})
          const refreshToken = this.jwtService.sign(payloadRefresh, {expiresIn: '10m'})
          await this.devicesRepo.updateDevice(device.deviceId.toString(), issuedAt, expiresAt)
          return {
            accessToken,
            refreshToken
          }
        } else {
          throw new HttpException('Auth not found', HttpStatus.UNAUTHORIZED)
        }
      }
      catch(e){
        throw new HttpException('Auth not found', HttpStatus.UNAUTHORIZED)
      }
    }
}
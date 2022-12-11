import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JWT } from '../../../helpers/helpers/jwt';
import { DevicesRepo } from '../infrastructure/devices.repo';

@Injectable()
export class DevicesService {
  constructor(
    private devicesRepo: DevicesRepo,
    private jwtService: JWT,
  ) {}

  async findAllDevicesByCurrentUserId(refreshToken: string){
    const token = this.jwtService.verify(refreshToken)
    const devices = await this.devicesRepo.findAllDevicesByCurrentUserId(token.userId)
    return devices.map(d => {
      return {
        ip: d.ip,
        title: d.title,
        lastActiveDate: new Date(+d.issuedAt).toISOString(),
        deviceId: d.deviceId,
      }
    })
  }

  async deleteAllDeviceByCurrentUserIdExceptCurrentDevice(refreshToken: string){
    const token = this.jwtService.verify(refreshToken)
    return await this.devicesRepo.deleteAllDeviceByCurrentUserIdExceptCurrentDevice(token.deviceId, token.userId)
  }

  async deleteOneDeviceById(deviceId: string, refreshToken: string){
    const token = this.jwtService.verify(refreshToken)
    const candidateDevice = await this.devicesRepo.findOneById(deviceId)
    if(candidateDevice && (token.userId !== candidateDevice?.userId)) {
      throw new HttpException('Device not your', HttpStatus.FORBIDDEN)
    }
    const device = await this.devicesRepo.deleteOneDeviceById(deviceId, token.userId)
    if(device.deletedCount === 0){
      throw new HttpException('Device not found', HttpStatus.NOT_FOUND)
    } else {
      return
    }
  }

}
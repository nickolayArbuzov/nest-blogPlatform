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
    console.log('token', token)
    return await this.devicesRepo.findAllDevicesByCurrentUserId()
  }

  async deleteAllDeviceByCurrentUserIdExceptCurrentDevice(refreshToken: string){
    const token = this.jwtService.verify(refreshToken)
    console.log('token', token)
    return await this.devicesRepo.deleteAllDeviceByCurrentUserIdExceptCurrentDevice()
  }

  async deleteOneDeviceById(id: string, refreshToken: string){
    const token = this.jwtService.verify(refreshToken)
    console.log('token', token)
    const post = await this.devicesRepo.deleteOneDeviceById(id)
    if(post.deletedCount === 0){
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND)
    } else {
      return
    }
  }

}
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { DevicesRepo } from '../infrastructure/devices.repo';

@Injectable()
export class DevicesService {
  constructor(
    private devicesRepo: DevicesRepo,
  ) {}

  async findAllDevicesByCurrentUserId(){
    return await this.devicesRepo.findAllDevicesByCurrentUserId()
  }

  async deleteAllDeviceByCurrentUserIdExceptCurrentDevice(){
    return await this.devicesRepo.deleteAllDeviceByCurrentUserIdExceptCurrentDevice()
  }

  async deleteOneDeviceById(id: string){
    const post = await this.devicesRepo.deleteOneDeviceById(id)
    if(post.deletedCount === 0){
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND)
    } else {
      return
    }
  }

}
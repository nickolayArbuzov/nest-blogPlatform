import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Device } from '../domain/entitites/device';
import { DeviceModel } from '../domain/entitites/device.interface';

@Injectable()
export class DevicesMongoose {
  constructor(
    @Inject('DEVICE_MONGOOSE')
    private Device: Model<DeviceModel>,
  ) {}

  async findAllDevicesByCurrentUserId(){
    return await this.Device.countDocuments();
  }

  async deleteAllDeviceByCurrentUserIdExceptCurrentDevice(){
    return await this.Device.deleteOne()
  }

  async deleteOneDeviceById(id: string){
    return await this.Device.deleteOne({_id: id})
  }

  async createDevice(device: Device){
    await this.Device.create(device)
    return true
  }

  async findOneDeviceByRefreshTokenData(deviceId: string, issuedAt: number){
    return await this.Device.findOne({deviceId: deviceId, issuedAt: issuedAt})
  }

  async updateDevice(deviceId: string, issuedAt: number, expiresAt: number){
    return await this.Device.updateOne({deviceId: deviceId}, {$set: {issuedAt: issuedAt, expiresAt: expiresAt}})
  }

  async logout(userId: string, deviceId: string, issuedAt: number){
    return await this.Device.deleteOne({userId: userId, deviceId: deviceId, issuedAt: issuedAt})
  }
}
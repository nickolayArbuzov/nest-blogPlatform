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

  async findAllDevicesByCurrentUserId(userId: string){
    return await this.Device.find({userId: userId})
  }

  async findOneById(deviceId: string){
    return await this.Device.findOne({deviceId: deviceId});
  }

  async deleteAllDeviceByCurrentUserIdExceptCurrentDevice(deviceId: string, userId: string){
    return await this.Device.deleteMany({userId: userId, deviceId: {$ne: deviceId}})
  }

  async deleteOneDeviceById(deviceId: string, userId: string){
    return await this.Device.deleteOne({deviceId: deviceId, userId: userId})
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
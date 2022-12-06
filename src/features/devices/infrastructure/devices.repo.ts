import { Inject, Injectable } from '@nestjs/common';
import { Device } from '../domain/entitites/device';
import { DevicesMongoose } from './devices.repositoryMongo';

@Injectable()
export class DevicesRepo {
  constructor(private devicesMongoose: DevicesMongoose) {}

  async findAllDevicesByCurrentUserId(){
    return await this.devicesMongoose.findAllDevicesByCurrentUserId()
  }

  async deleteAllDeviceByCurrentUserIdExceptCurrentDevice(){
    return await this.devicesMongoose.deleteAllDeviceByCurrentUserIdExceptCurrentDevice()
  }

  async deleteOneDeviceById(id: string){
    return await this.devicesMongoose.deleteOneDeviceById(id)
  }

  async createDevice(device: Device){
    await this.devicesMongoose.createDevice(device)
    return true
  }

  async findOneDeviceByRefreshTokenData(deviceId: string, issuedAt: number){
    return await this.devicesMongoose.findOneDeviceByRefreshTokenData(deviceId, issuedAt)
  }

  async updateDevice(deviceId: string, issuedAt: number, expiresAt: number){
    return await this.devicesMongoose.updateDevice(deviceId, issuedAt, expiresAt)
  }

  async logout(userId: string, deviceId: string){
    return await this.devicesMongoose.logout(userId, deviceId)
  }
}
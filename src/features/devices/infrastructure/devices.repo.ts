import { Injectable } from '@nestjs/common';
import { Device } from '../domain/entitites/device';
import { DevicesMongoose } from './devices.repositoryMongo';
import { DevicesSQL } from './devices.repositorySQL';

@Injectable()
export class DevicesRepo {
  constructor(
    private devicesRepo: DevicesSQL
  ) {}

  async findAllDevicesByCurrentUserId(userId: string){
    return await this.devicesRepo.findAllDevicesByCurrentUserId(userId)
  }

  async findOneById(deviceId: string){
    return await this.devicesRepo.findOneById(deviceId)
  }

  async deleteAllDeviceByCurrentUserIdExceptCurrentDevice(deviceId: string, userId: string){
    return await this.devicesRepo.deleteAllDeviceByCurrentUserIdExceptCurrentDevice(deviceId, userId)
  }

  async deleteOneDeviceById(deviceId: string, userId: string){
    return await this.devicesRepo.deleteOneDeviceById(deviceId, userId)
  }

  async createDevice(device: Device){
    await this.devicesRepo.createDevice(device)
    return true
  }

  async findOneDeviceByRefreshTokenData(deviceId: string, issuedAt: number){
    return await this.devicesRepo.findOneDeviceByRefreshTokenData(deviceId, issuedAt)
  }

  async updateDevice(deviceId: string, issuedAt: number, expiresAt: number){
    return await this.devicesRepo.updateDevice(deviceId, issuedAt, expiresAt)
  }

  async logout(userId: string, deviceId: string, issuedAt: number){
    return await this.devicesRepo.logout(userId, deviceId, issuedAt)
  }
}
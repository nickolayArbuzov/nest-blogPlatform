import { Inject, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Device } from '../domain/entitites/device';

@Injectable()
export class DevicesSQL {
  constructor(
    @InjectDataSource() private readonly db: DataSource
  ) {}

  async findAllDevicesByCurrentUserId(userId: string){
    return await this.db.query(
      `
        select ip, title, "issuedAt", "deviceId"
        from devices
        where "userId" = $1
      `,
      [userId]
    )
  }

  async findOneById(deviceId: string){
    const device = await this.db.query(
      `
        select "userId"
        from devices
        where "deviceId" = $1
      `,
      [deviceId]
    )
    return device[0]
  }

  async deleteAllDeviceByCurrentUserIdExceptCurrentDevice(deviceId: string, userId: string){
    return await this.db.query(
      `
        delete from devices
        where "userId" = $2 and "deviceId" <> $1
      `,
      [deviceId, userId]
    )
  }

  async deleteOneDeviceById(deviceId: string, userId: string){
    const deleteDevice = await this.db.query(
      `
        delete from devices
        where "userId" = $2 and "deviceId" = $1
      `,
      [deviceId, userId]
    )
    return {
      deletedCount: deleteDevice[1]
    }
  }

  async createDevice(device: Device){
    const createDevice = await this.db.query(
      `
        insert into devices
        (ip, title, "deviceId", "issuedAt", "expiresAt", "userId")
        values ($1, $2, $3, $4, $5, $6)
        returning id, ip, title, "deviceId", "issuedAt", "expiresAt", "userId"
      `,
      [device.ip, device.title, device.deviceId, device.issuedAt, device.expiresAt, device.userId]
    )
    return createDevice[0]
  }

  async findOneDeviceByRefreshTokenData(deviceId: string, issuedAt: number){
    const device = await this.db.query(
      `
        select *
        from devices
        where "deviceId" = $1 and "issuedAt" = $2
      `,
      [deviceId, issuedAt]
    )
    return device[0]
  }

  async updateDevice(deviceId: string, issuedAt: number, expiresAt: number){
    return await this.db.query(
      `
        update devices
        set "issuedAt" = $2, "expiresAt" = $3
        where "deviceId" = $1
      `,
      [deviceId, issuedAt, expiresAt]
    )
  }

  async logout(userId: string, deviceId: string, issuedAt: number){
    const deleteDevice = await this.db.query(
      ` 
        delete from devices
        where "userId" = $1 and "deviceId" = $2 and "issuedAt" = $3
      `,
      [userId, deviceId, issuedAt]
    )
    return {
      deletedCount: deleteDevice[1]
    }
  }
}
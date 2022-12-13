import { QueryHandler } from '@nestjs/cqrs';
import { JWT } from '../../../../helpers/helpers/jwt';
import { DevicesRepo } from '../../infrastructure/devices.repo';

export class FindAllDevicesByCurrentUserIdQuery {
  constructor(
    public refreshToken: string,
  ) {}
}

@QueryHandler(FindAllDevicesByCurrentUserIdQuery)
export class FindAllDevicesByCurrentUserIdUseCase {
  constructor(
    private devicesRepo: DevicesRepo,
    private jwtService: JWT,
  ) {}

  async execute(query: FindAllDevicesByCurrentUserIdQuery){
    const token = this.jwtService.verify(query.refreshToken)
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
}
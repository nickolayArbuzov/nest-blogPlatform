import { CommandHandler } from '@nestjs/cqrs';
import { JWT } from '../../../../helpers/helpers/jwt';
import { DevicesRepo } from '../../infrastructure/devices.repo';

export class DeleteAllDeviceByCurrentUserIdExceptCurrentDeviceCommand {
  constructor(
    public refreshToken: string,
  ) {}
}

@CommandHandler(DeleteAllDeviceByCurrentUserIdExceptCurrentDeviceCommand)
export class DeleteAllDeviceByCurrentUserIdExceptCurrentDeviceUseCase {
  constructor(
    private devicesRepo: DevicesRepo,
    private jwtService: JWT,
  ) {}

  async execute(command: DeleteAllDeviceByCurrentUserIdExceptCurrentDeviceCommand){
    const token = this.jwtService.verify(command.refreshToken)
    return await this.devicesRepo.deleteAllDeviceByCurrentUserIdExceptCurrentDevice(token.deviceId, token.userId)
  }
}
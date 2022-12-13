import { HttpException, HttpStatus } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { JWT } from '../../../../helpers/helpers/jwt';
import { DevicesRepo } from '../../infrastructure/devices.repo';

export class DeleteOneDeviceByIdCommand {
  constructor(
    public deviceId: string,
    public refreshToken: string,
  ) {}
}

@CommandHandler(DeleteOneDeviceByIdCommand)
export class DeleteOneDeviceByIdUseCase {
  constructor(
    private devicesRepo: DevicesRepo,
    private jwtService: JWT,
  ) {}

  async execute(command: DeleteOneDeviceByIdCommand){
    const token = this.jwtService.verify(command.refreshToken)
    const candidateDevice = await this.devicesRepo.findOneById(command.deviceId)
    if(candidateDevice && (token.userId !== candidateDevice?.userId)) {
      throw new HttpException('Device not your', HttpStatus.FORBIDDEN)
    }
    const device = await this.devicesRepo.deleteOneDeviceById(command.deviceId, token.userId)
    if(device.deletedCount === 0){
      throw new HttpException('Device not found', HttpStatus.NOT_FOUND)
    } else {
      return
    }
  }
}
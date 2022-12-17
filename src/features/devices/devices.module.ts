import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { LoggerModule } from '../../helpers/logger/logger.module';
import { JWT } from '../../helpers/helpers/jwt';
import { DatabaseModule } from '../../outerservices/database/database.module';
import { DevicesController } from './api/devices.controller';
import { DevicesService } from './application/devices.service';
import { devicesProviders } from './infrastructure/devices.providers';
import { DevicesRepo } from './infrastructure/devices.repo';
import { DevicesMongoose } from './infrastructure/devices.repositoryMongo';
import { FindAllDevicesByCurrentUserIdUseCase } from './application/use-cases/FindAllDevicesByCurrentUserId';
import { DeleteOneDeviceByIdUseCase } from './application/use-cases/DeleteOneDeviceById';
import { DeleteAllDeviceByCurrentUserIdExceptCurrentDeviceUseCase } from './application/use-cases/DeleteAllDeviceByCurrentUserIdExceptCurrentDevice';
import { CqrsModule } from '@nestjs/cqrs';

const commands = [DeleteOneDeviceByIdUseCase, DeleteAllDeviceByCurrentUserIdExceptCurrentDeviceUseCase]
const queries = [FindAllDevicesByCurrentUserIdUseCase]

@Module({
  controllers: [DevicesController],
  imports: [LoggerModule, DatabaseModule, JwtModule, CqrsModule, LoggerModule],
  providers: [
    ...devicesProviders,
    DevicesService,
    DevicesRepo,
    DevicesMongoose,
    JWT,
    ...commands,
    ...queries,
  ],
  exports: [
    DevicesRepo,
    devicesProviders.find(v => v.provide === 'DEVICE_MONGOOSE'),
  ]
})
export class DevicesModule {}

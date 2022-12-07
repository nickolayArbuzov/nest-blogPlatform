import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from '../../outerservices/database/database.module';
import { DevicesController } from './api/devices.controller';
import { DevicesService } from './application/devices.service';
import { devicesProviders } from './infrastructure/devices.providers';
import { DevicesRepo } from './infrastructure/devices.repo';
import { DevicesMongoose } from './infrastructure/devices.repositoryMongo';

@Module({
  controllers: [DevicesController],
  imports: [
    DatabaseModule, 
    JwtModule,
  ],
  providers: [
    ...devicesProviders,
    DevicesService,
    DevicesRepo,
    DevicesMongoose,
  ],
  exports: [
    DevicesRepo,
    devicesProviders.find(v => v.provide === 'DEVICE_MONGOOSE'),
  ]
})
export class DevicesModule {}

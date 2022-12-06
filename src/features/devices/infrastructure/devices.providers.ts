import { Connection } from 'mongoose';
import { DeviceSchema } from '../domain/entitites/device.schema';

export const devicesProviders = [
  {
    provide: 'DEVICE_MONGOOSE',
    useFactory: (connection: Connection) => connection.model('Devices', DeviceSchema),
    inject: ['DATABASE_MONGOOSE'],
  }
];
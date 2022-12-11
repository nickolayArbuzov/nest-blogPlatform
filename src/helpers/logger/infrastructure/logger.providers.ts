import { Connection } from 'mongoose';
import { LoggerSchema } from '../domain/entitites/logger.schema';

export const LoggerProviders = [
  {
    provide: 'LOGGER_MONGOOSE',
    useFactory: (connection: Connection) => connection.model('Logger', LoggerSchema),
    inject: ['DATABASE_MONGOOSE'],
  }
];
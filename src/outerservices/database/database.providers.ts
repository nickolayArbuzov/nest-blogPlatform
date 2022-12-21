import * as mongoose from 'mongoose';
import { DataSource } from 'typeorm';
import * as config from '../../config/database'

export const databaseProviders = [
  {
    provide: 'DATABASE_MONGOOSE',
    useFactory: (): Promise<typeof mongoose> =>
      mongoose.connect('mongodb+srv://admin:admin@cluster0.mpqdpmz.mongodb.net/?retryWrites=true&w=majority', {dbName: 'test'}),
  },
];
import { Document } from 'mongoose';

export interface LoggerModel extends Document {
    readonly path: String,
    readonly date: String,
}
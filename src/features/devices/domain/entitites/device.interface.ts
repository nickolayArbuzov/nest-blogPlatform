import { Document } from 'mongoose';

export interface DeviceModel extends Document {
    readonly ip: String,
    readonly title: String,
    readonly deviceId: String,
    readonly issuedAt: Number,
    readonly expiresAt: Number,
    readonly userId: String,
}
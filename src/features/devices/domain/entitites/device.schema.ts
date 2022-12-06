import * as mongoose from 'mongoose';

export const DeviceSchema = new mongoose.Schema({
    ip: String,
    title: String,
    deviceId: String,
    issuedAt: Number,
    expiresAt: Number,
    userId: String,
});
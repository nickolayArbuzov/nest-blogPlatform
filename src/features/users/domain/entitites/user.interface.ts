import { Document } from 'mongoose';

export interface UserModel extends Document {
    readonly login: String,
    readonly email: String,
    readonly passwordHash: String,
    readonly passwordSalt: String,
    readonly isActivated: Boolean,
    readonly code: String,
    readonly createdAt: String,
}
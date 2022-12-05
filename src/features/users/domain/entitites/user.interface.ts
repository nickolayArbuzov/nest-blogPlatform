import { Document } from 'mongoose';

export interface UserModel extends Document {
    readonly login: String,
    readonly email: String,
    readonly password: String,
    readonly createdAt: String,
}
import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
    login: String,
    email: String,
    passwordHash: String,
    passwordSalt: String,
    isActivated: Boolean,
    code: String,
    createdAt: String,
});
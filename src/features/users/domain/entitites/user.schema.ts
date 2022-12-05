import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
    login: String,
    email: String,
    password: String,
    createdAt: String,
});
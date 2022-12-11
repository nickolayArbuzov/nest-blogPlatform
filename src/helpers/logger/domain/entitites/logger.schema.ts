import * as mongoose from 'mongoose';

export const LoggerSchema = new mongoose.Schema({
    path: String,
    date: String,
});
import * as mongoose from 'mongoose';

export const BloggerUserSchema = new mongoose.Schema({
    blogId: String,
    bannedUserId: String,
    banInfo: {banDate: String, banReason: String},
});
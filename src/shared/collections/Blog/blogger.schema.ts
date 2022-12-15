import * as mongoose from 'mongoose';

export const BlogSchema = new mongoose.Schema({
    name: String,
    description: String,
    websiteUrl: String,
    createdAt: String,
    blogOwnerInfo: {userId: String, userLogin: String},
    banInfo: {isBanned: Boolean, banDate: String},
});
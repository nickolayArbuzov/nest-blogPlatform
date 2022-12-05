import * as mongoose from 'mongoose';

export const PostSchema = new mongoose.Schema({
    title: String,
    shortDescription: String,
    content: String,
    blogId: String,
    blogName: String,
    createdAt: String,
});
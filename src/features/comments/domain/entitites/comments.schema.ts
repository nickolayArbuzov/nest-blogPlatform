import * as mongoose from 'mongoose';

export const CommentSchema = new mongoose.Schema({
    content: String,
    userId: String,
    userLogin: String,
    postId: String,
    createdAt: String,
});
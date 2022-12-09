import * as mongoose from 'mongoose';

export const LikeSchema = new mongoose.Schema({
    userId: String,
    login: String,
    postId: {type: String, nullable: true},
    commentId: {type: String, nullable: true},
    addedAt: String,
    status: String,
});
import * as mongoose from 'mongoose';

export const CommentSchema = new mongoose.Schema({
    blogOwnerUserId: String,
    content: String,
    createdAt: String,
    commentatorInfo: {userId: String, userLogin: String},
    postInfo: {id: String, title: String, blogId: String, blogName: String},
});
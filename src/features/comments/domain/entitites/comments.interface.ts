import { Document } from 'mongoose';

export interface CommentModel extends Document {
    readonly content: String,
    readonly userId: String,
    readonly userLogin: String,
    readonly postId: String,
    readonly createdAt: String,
}
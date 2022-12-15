import { Document } from 'mongoose';

export interface CommentModel extends Document {
    readonly blogOwnerUserId: String,
    readonly content: String,
    readonly createdAt: String,
    readonly commentatorInfo: {userId: String, userLogin: String},
    readonly postInfo: {id: String, title: String, blogId: String, blogName: String},
}
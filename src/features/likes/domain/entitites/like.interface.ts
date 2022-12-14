import { Document } from 'mongoose';

export interface LikeModel extends Document {
    readonly userId: String,
    readonly banned: Boolean,
    readonly login: String,
    readonly postId: String | null,
    readonly commentId: String | null,
    readonly addedAt: String,
    readonly status: String,
}

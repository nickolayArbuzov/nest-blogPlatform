import { Document } from 'mongoose';

export interface BloggerUserModel extends Document {
    readonly blogId: String,
    readonly bannedUserId: String,
}
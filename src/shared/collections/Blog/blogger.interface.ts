import { Document } from 'mongoose';

export interface BlogModel extends Document {
    readonly name: String,
    readonly description: String,
    readonly websiteUrl: String,
    readonly createdAt: String,
    readonly blogOwnerInfo: {userId: String, userLogin: String},
    readonly banInfo: {isBanned: Boolean, banDate: String},
}
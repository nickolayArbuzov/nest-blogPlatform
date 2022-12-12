import { Document } from 'mongoose';

export interface BlogModel extends Document {
    readonly name: String,
    readonly description: String,
    readonly websiteUrl: String,
    readonly createdAt: String,
}
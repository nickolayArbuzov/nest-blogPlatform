import { Document } from 'mongoose';

export interface PostModel extends Document {
    readonly title: String,
    readonly shortDescription: String,
    readonly content: String,
    readonly blogId: String,
    readonly blogName: String,
    readonly createdAt: String,
}
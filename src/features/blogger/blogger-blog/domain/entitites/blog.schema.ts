import * as mongoose from 'mongoose';

export const BlogSchema = new mongoose.Schema({
    name: String,
    description: String,
    websiteUrl: String,
    createdAt: String,
});
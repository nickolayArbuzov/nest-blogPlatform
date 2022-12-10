import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Like } from '../domain/entitites/like';
import { LikeModel } from '../domain/entitites/like.interface';

@Injectable()
export class LikesMongoose {
  constructor(
    @Inject('LIKE_MONGOOSE')
    private Like: Model<LikeModel>,
  ) {}

  async findOne(userId: string, postId: string | null, commentId: string | null){
    return await this.Like.findOne({userId: userId, postId: postId, commentId : commentId})
  }
  async deleteOne(userId: string, postId: string | null, commentId: string | null){
    return await this.Like.deleteOne({userId: userId, postId: postId, commentId : commentId})
  }
  async updateOne(userId: string, postId: string | null, commentId: string | null, likeStatus: string){
    return await this.Like.updateOne({userId: userId, postId: postId, commentId : commentId}, {$set: {status: likeStatus}})
  }
  async insertOne(like: Like){
    return await this.Like.create(like)
  }

  async getLikesInfoForComment(commentId: string){
    return await this.Like.find({commentId: commentId})
  }

  async getLikesInfoForPost(postId: string){
    return await this.Like.find({postId: postId})
  }
}
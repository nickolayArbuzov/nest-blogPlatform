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
    return this.Like.findOne({userId: userId, postId: postId, commentId : commentId})
  }
  async deleteOne(userId: string, postId: string | null, commentId: string | null){
    return this.Like.deleteOne({userId: userId, postId: postId, commentId : commentId})
  }
  async updateOne(userId: string, postId: string | null, commentId: string | null, likeStatus: string){
    return this.Like.deleteOne({userId: userId, postId: postId, commentId : commentId}, {$set: {status: likeStatus}})
  }
  async insertOne(like: Like){
    return this.Like.create(like)
  }

  async getLikesInfoForComment(commentId: string){
    return this.Like.find({commentId: commentId})
  }

  async getLikesInfoForPost(postId: string){
    return this.Like.find({postId: postId})
  }
}
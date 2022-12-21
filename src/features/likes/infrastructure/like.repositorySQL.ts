import { Inject, Injectable } from '@nestjs/common';
import { Like } from '../domain/entitites/like';

@Injectable()
export class LikesSQL {
  constructor(
  ) {}

  async findOne(userId: string, postId: string | null, commentId: string | null){
    return
  }
  async deleteOne(userId: string, postId: string | null, commentId: string | null){
    return
  }
  async updateOne(userId: string, postId: string | null, commentId: string | null, likeStatus: string){
    return
  }
  async insertOne(like: Like){
    return
  }
  async getLikesInfoForComment(commentId: string){
    return
  }
  async getLikesInfoForPost(postId: string){
    return
  }
  async updateBannedStatusInLikes(userId: string, banned: boolean){
    return
  }
}
import { Injectable } from '@nestjs/common';
import { Like } from '../domain/entitites/like';
import { LikesMongoose } from './like.repositoryMongo';
import { LikesSQL } from './like.repositorySQL';

@Injectable()
export class LikesRepo {
  constructor(private likesRepo: LikesSQL) {}

  async like(user: {userId: string, userLogin: string}, likeStatus: string, postId: string | null, commentId: string | null) {
    const likePosition = await this.likesRepo.findOne(user.userId, postId ? postId : null, commentId ? commentId : null)
    if(likePosition) {
        if(likeStatus === 'None') {
            await this.likesRepo.deleteOne(user.userId, postId ? postId : null, commentId ? commentId : null)
        }
        if(likeStatus !== likePosition.status) {
            await this.likesRepo.updateOne(user.userId, postId ? postId : null, commentId ? commentId : null, likeStatus)
        }
    } 
    if(!likePosition && likeStatus !== 'None') {
        await this.likesRepo.insertOne({
            userId: user.userId,
            banned: false,
            login: user.userLogin,
            postId: postId,
            commentId: commentId,
            addedAt: new Date().toISOString(),
            status: likeStatus,
        })
    }
    return true
  }

  async updateBannedStatusInLikes(userId: string, banned: boolean){
    return this.likesRepo.updateBannedStatusInLikes(userId, banned)
  }

  async getLikesInfoForComment(commentId: string, userId: string) {
      const likeInfo = await this.likesRepo.getLikesInfoForComment(commentId)
      return {
          dislikesCount: likeInfo.filter(li => li.commentId === commentId && li.status === 'Dislike').length,
          likesCount: likeInfo.filter(li => li.commentId === commentId && li.status === 'Like').length, 
          myStatus: likeInfo.find(li => li.commentId === commentId && li.userId === userId) ? likeInfo.find(li => li.commentId === commentId && li.userId === userId)?.status : 'None',
      }
  }

  async getLikesInfoForPost(postId: string, userId: string) {
    const likeInfo = await this.likesRepo.getLikesInfoForPost(postId)
    return {
        dislikesCount: likeInfo.filter(li => li.postId === postId && li.status === 'Dislike').length,
        likesCount: likeInfo.filter(li => li.postId === postId && li.status === 'Like').length, 
        myStatus: likeInfo.find(li => li.postId === postId && li.userId === userId) ? likeInfo.find(li => li.postId === postId && li.userId === userId)?.status : 'None',
        newestLikes: [...likeInfo.filter(l => l.status === 'Like').sort((a, b) => a.addedAt > b.addedAt ? -1 : 1).slice(0, 3).map(l => {
            return {addedAt: l.addedAt, userId: l.userId, login: l.login}
        })]
    }
  }
}
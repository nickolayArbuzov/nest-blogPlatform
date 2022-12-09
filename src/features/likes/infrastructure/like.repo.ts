import { Inject, Injectable } from '@nestjs/common';
import { Like } from '../domain/entitites/like';
import { LikesMongoose } from './like.repositoryMongo';

@Injectable()
export class LikesRepo {
  constructor(private likesMongoose: LikesMongoose) {}

  async like(user: any, likeStatus: string, postId: string | null, commentId: string | null) {

    const likePosition = await this.likesMongoose.findOne(user.id, postId ? postId : null, commentId ? commentId : null)
    if(likePosition) {
        if(likeStatus === 'None') {
            await this.likesMongoose.deleteOne(user.id, postId ? postId : null, commentId ? commentId : null)
        }
        if(likeStatus !== likePosition.status) {
            await this.likesMongoose.updateOne(user.id, postId ? postId : null, commentId ? commentId : null, likeStatus)
        }
    } 
    if(!likePosition && likeStatus !== 'None') {
        await this.likesMongoose.insertOne({
            userId: user.id!,
            login: user.login,
            postId: postId,
            commentId: commentId,
            addedAt: new Date().toISOString(),
            status: likeStatus,
        })
    }
    
    return true
  }

  async getLikesInfoForComment(commentId: string, userId: string) {
      const likeInfo = await this.likesMongoose.getLikesInfoForComment(commentId)
      return {
          dislikesCount: likeInfo.filter(li => li.commentId === commentId && li.status === 'Dislike').length,
          likesCount: likeInfo.filter(li => li.commentId === commentId && li.status === 'Like').length, 
          myStatus: likeInfo.find(li => li.commentId === commentId && li.userId === userId) ? likeInfo.find(li => li.commentId === commentId && li.userId === userId)?.status : 'None',
      }
  }

  async getLikesInfoForPost(postId: string, userId: string) {
    const likeInfo = await this.likesMongoose.getLikesInfoForPost(postId)
    console.log('likeInfo', likeInfo)
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
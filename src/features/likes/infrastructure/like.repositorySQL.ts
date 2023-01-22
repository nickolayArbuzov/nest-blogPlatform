import { Inject, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Like } from '../domain/entitites/like';

@Injectable()
export class LikesSQL {
  constructor(
    @InjectDataSource() private readonly db: DataSource
  ) {}

  async findOne(userId: string, postId: string | null, commentId: string | null){
    const like = await this.db.query(
      `
        select * 
        from likes
        where "userId" = $1 and ("postId" = $2 or "commentId" = $3)
      `,
      [userId, postId, commentId]
    )
    return like[0]
  }
  async deleteOne(userId: string, postId: string | null, commentId: string | null){
    return await this.db.query(
      `
        delete from likes
        where "userId" = $1 and ("postId" = $2 or "commentId" = $3)
      `,
      [userId, postId, commentId]
    )
  }
  async updateOne(userId: string, postId: string | null, commentId: string | null, likeStatus: string){
    return await this.db.query(
      `
        update likes
        set status = $4
        where "userId" = $1 and ("postId" = $2 or "commentId" = $3)
      `,
      [userId, postId, commentId, likeStatus]
    )
  }
  async insertOne(like: Like){
    return await this.db.query(
      `
        insert into likes
        ("userId", banned, login, "postId", "commentId", "addedAt", status)
        values($1, $2, $3, $4, $5, $6, $7)
      `,
      [like.userId, like.banned, like.login, like.postId, like.commentId, like.addedAt, like.status]
    )
  }
  async getLikesInfoForComment(commentId: string){
    const likes = await this.db.query(
      `
        select *
        from likes
        where "commentId" = $1 and banned = false
      `,
      [commentId]
    )
    return likes
  }
  async getLikesInfoForPost(postId: string){
    const likes = await this.db.query(
      `
        select *
        from likes
        where "postId" = $1 and banned = false
      `,
      [postId]
    )
    return likes
  }
  async updateBannedStatusInLikes(userId: string, banned: boolean){
    return await this.db.query(
      `
        update likes
        set banned = $2
        where "userId" = $1
      `,
      [userId, banned]
    )
  }
}
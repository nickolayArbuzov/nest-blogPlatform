import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { createComment } from 'test/constants';
import { DataSource } from 'typeorm';
import { QueryBlogDto } from '../../../helpers/constants/commonDTO/query.dto';
import { Comment } from '../domain/entitites/comments'
import { UpdateCommentDto } from '../dto/comment.dto';

@Injectable()
export class CommentsSQL {
  constructor(
    @InjectDataSource() private readonly db: DataSource
  ) {}

  async findAllCommentByPostId(postId: string, query: QueryBlogDto){
    const orderByWithDirection = `"${query.sortBy}" ${query.sortDirection}`
    const comments = await this.db.query(
      `
        select id, content, "commentatorUserId", "commentatorUserLogin", "createdAt"
        from comments
        where postId = $3
        order by ${orderByWithDirection} 
        limit $2
        offset $1
      `,
      [(+query.pageNumber-1) * +query.pageSize, query.pageSize, postId]
    )
    const totalCount = await this.db.query(
      `
        select count(*) 
        from comments
        where postId = $1
      `,
      [postId]
    )

    return {
      pagesCount: Math.ceil(+totalCount[0].count/+query.pageSize),
      page: +query.pageNumber,
      pageSize: +query.pageSize,
      totalCount: +totalCount[0].count,
      items: comments.map(i => {
        return {
          id: i.id,
          content: i.content,
          userId: i.commentatorInfo.userId,
          userLogin: i.commentatorInfo.userLogin,
          createdAt: i.createdAt,
        }
      }),
    }
  }

  async updateOneCommentById(commentId: string, updateComment: UpdateCommentDto){
    const updatedComment = await this.db.query(
      `
        update comments
        set content = $2
        where id = $1
      `,
      [commentId, updateComment.content]
    )
    return updatedComment
  }

  async deleteOneCommentById(commentId: string){
    const deletedComment = await this.db.query(
      `
        delete from comments
        where id = $1
      `,
      [commentId]
    )
    return deletedComment
  }

  async findOneCommentById(commentId: string){
    const comment = await this.db.query(
      `
        select * 
        from comments
        where id = $1
      `,
      [commentId]
    )
    return comment
  }

  async createCommentFromPost(newComment: Comment){
    const createComment = await this.db.query(
      `
        insert into comments
        ("blogOwnerUserId", content, "createdAt", "commentatorUserId", "commentatorUserLogin", "postId", "postTitle", "blogId", "blogName")
        values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        returning id, "blogOwnerUserId", content, "createdAt", "userId", "userLogin", "postId", "postTitle", "blogId", "blogName"
      `, 
      [
        newComment.blogOwnerUserId, newComment.content, newComment.createdAt, newComment.commentatorInfo.userId, newComment.commentatorInfo.userLogin, 
        newComment.postInfo.id, newComment.postInfo.title, newComment.postInfo.blogId, newComment.postInfo.blogName
      ]
    )

    return {
      _id: createComment[0].id,
      blogOwnerUserId: createComment[0].blogOwnerUserId,
      content: createComment[0].content,
      createdAt: createComment[0].createdAt,
      commentatorInfo: {
        userId: createComment[0].userId,
        userLogin: createComment[0].userLogin,
      },
      postInfo: {
        id: createComment[0].postId,
        title: createComment[0].postTitle,
        blogId: createComment[0].blogId,
        blogName: createComment[0].blogName,
      },
    }
  }

  async findCommentsByBloggerId(query: QueryBlogDto, bloggerId: string){
    const orderByWithDirection = `"${query.sortBy}" ${query.sortDirection}`
    const comments = await this.db.query(
      `
        select id, content, "commentatorUserId", "commentatorUserLogin", "createdAt"
        from comments
        where blogOwnerUserId = $3
        order by ${orderByWithDirection} 
        limit $2
        offset $1
      `,
      [(+query.pageNumber-1) * +query.pageSize, query.pageSize, bloggerId]
    )
    const totalCount = await this.db.query(
      `
        select count(*) 
        from comments
        where blogOwnerUserId = $1
      `,
      [bloggerId]
    )

    return {
      pagesCount: Math.ceil(+totalCount[0].count/+query.pageSize),
      page: +query.pageNumber,
      pageSize: +query.pageSize,
      totalCount: +totalCount[0].count,
      items: comments.map(i => {
        return {
          id: i.id,
          content: i.content,
          userId: i.commentatorInfo.userId,
          userLogin: i.commentatorInfo.userLogin,
          createdAt: i.createdAt,
        }
      }),
    }
  }

}
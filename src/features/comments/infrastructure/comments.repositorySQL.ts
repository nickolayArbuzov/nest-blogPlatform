import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
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
        where "postId" = $3
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
        where "postId" = $1
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
          userId: i.commentatorUserId,
          userLogin: i.commentatorUserLogin,
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
    if(comment[0]){
      return {
        id: comment[0].id,
        content: comment[0].content,
        userId: comment[0].commentatorUserId,
        userLogin: comment[0].commentatorUserLogin,
        createdAt: comment[0].createdAt,
        likesInfo: {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: "None",
        }
      }
    } else {
      return null
    }
  }

  async createCommentFromPost(newComment: Comment){
    const createComment = await this.db.query(
      `
        insert into comments
        ("blogOwnerUserId", content, "createdAt", "commentatorUserId", "commentatorUserLogin", "postId", "postTitle", "blogId", "blogName")
        values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        returning id, "blogOwnerUserId", content, "createdAt", "commentatorUserId", "commentatorUserLogin", "postId", "postTitle", "blogId", "blogName"
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
        userId: createComment[0].commentatorUserId,
        userLogin: createComment[0].commentatorUserLogin,
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
        select *
        from comments
        where "blogOwnerUserId" = $3
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
        where "blogOwnerUserId" = $1
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
          createdAt: i.createdAt,
          commentatorInfo: {
            userId: i.commentatorUserId,
            userLogin: i.commentatorUserLogin,
          },
          postInfo: {
            blogId: i.blogId,
            blogName: i.blogName,
            id: i.postId,
            title: i.postTitle,
          },
        }
      }),
    }
  }

}
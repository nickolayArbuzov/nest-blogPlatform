import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { QueryBlogDto } from '../../../helpers/constants/commonDTO/query.dto';
import { CommentModel } from '../domain/entitites/comments.interface';

@Injectable()
export class CommentsMongoose {
  constructor(
    @Inject('COMMENT_MONGOOSE')
    private Comment: Model<CommentModel>,
  ) {}

  async findAllCommentByPostId(postId: string, query: QueryBlogDto){
    let filter = {}
    if(postId){
      filter = {postId: postId}
    }

    const comments = await this.Comment
      .find(filter)
      .skip((+query.pageNumber - 1) * +query.pageSize)
      .limit(+query.pageSize)
      .sort({[query.sortBy] : query.sortDirection})
    
    const totalCount = await this.Comment.countDocuments(filter);
    
    return {
      pagesCount: Math.ceil(totalCount/+query.pageSize),
      page: +query.pageNumber,
      pageSize: +query.pageSize,
      totalCount: totalCount,
      items: comments.map(i => {
        return {
          id: i._id,
          content: i.content,
          userId: i.userId,
          userLogin: i.userLogin,
          createdAt: i.createdAt,
          likesInfo: {
            likesCount: 0,
            dislikesCount: 0,
            myStatus: "None",
          }
        }
      }),
    }
  }

  async findOneCommentById(id: string){
    const comment = await this.Comment.findOne({_id: id})
    return {
      id: comment._id,
      content: comment.content,
      userId: comment.userId,
      userLogin: comment.userLogin,
      createdAt: comment.createdAt,
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: "None",
      }
    }
  }

}
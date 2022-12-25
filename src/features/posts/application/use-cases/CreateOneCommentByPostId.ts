import { HttpException, HttpStatus } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { BloggerUserRepo } from '../../../blogger/blogger-user/infrastructure/blogger-user.repo';
import { BlogsRepo } from '../../../blogs/infrastructure/blogs.repo';
import { CreateCommentDto } from '../../../comments/dto/comment.dto';
import { CommentsRepo } from '../../../comments/infrastructure/comments.repo';
import { PostsRepo } from '../../infrastructure/posts.repo';

export class CreateOneCommentByPostIdCommand {
  constructor(
    public postId: string, 
    public newComment: CreateCommentDto, 
    public user: {userId: string, userLogin: string},
  ) {}
}

@CommandHandler(CreateOneCommentByPostIdCommand)
export class CreateOneCommentByPostIdUseCase {
  constructor(
    private postsRepo: PostsRepo,
    private commentsRepo: CommentsRepo,
    private blogsRepo: BlogsRepo,
    private bloggerUserRepo: BloggerUserRepo,
  ) {}

    async execute(command: CreateOneCommentByPostIdCommand){
      const post = await this.postsRepo.findOnePostById(command.postId)
      if(!post){
        throw new HttpException('Post not found', HttpStatus.NOT_FOUND)
      }
      const blog = await this.blogsRepo.findOneBlogWithUserId(post.blogId.toString())
      const bannedPosition = await this.bloggerUserRepo.findBannedPosition(blog.blogId, command.user.userId)
      if(bannedPosition){
        throw new HttpException('You are banned', HttpStatus.FORBIDDEN)
      }
      const date = new Date()
      const comment = {
        blogOwnerUserId: blog.blogOwnerInfo.userId.toString(),
        content: command.newComment.content,
        createdAt: date.toISOString(),
        commentatorInfo: {
          userId: command.user.userId,
          userLogin: command.user.userLogin,
        },
        postInfo: {
          id: post._id,
          title: post.title.toString(),
          blogId: post.blogId.toString(),
          blogName: post.blogName.toString(),
        },
      }
      const createdComment = await this.commentsRepo.createCommentFromPost(comment)
      return {
        id: createdComment._id,
        content: createdComment.content,
        userId: createdComment.commentatorInfo.userId,
        userLogin: createdComment.commentatorInfo.userLogin,
        createdAt: createdComment.createdAt,
        likesInfo: {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: "None",
        },
      }
    }
}
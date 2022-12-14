import { HttpException, HttpStatus } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { BloggerRepo } from '../../infrastructure/blogger.repo';
import { PostsRepo } from '../../../../posts/infrastructure/posts.repo';

export class DeleteOnePostOverBlogCommand {
  constructor(
    public blogId: string,
    public postId: string,
    public userId: string,
  ) {}
}

@CommandHandler(DeleteOnePostOverBlogCommand)
export class DeleteOnePostOverBlogUseCase {
  constructor(
    private bloggerRepo: BloggerRepo,
    private postsRepo: PostsRepo,
  ) {}

  async execute(command: DeleteOnePostOverBlogCommand){
    const candidateBlog = await this.bloggerRepo.findOneBlogById(command.blogId)
    if(!candidateBlog){
      throw new HttpException('Blog not found', HttpStatus.NOT_FOUND)
    }
    if(candidateBlog.blogOwnerInfo.userId !== command.userId){
      throw new HttpException('Blog not your', HttpStatus.FORBIDDEN)
    }
    const candidatePost = await this.postsRepo.findOnePostById(command.postId)
    if(!candidatePost){
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND)
    }
    if(candidatePost.blogId !== command.blogId){
      throw new HttpException('Post not your', HttpStatus.FORBIDDEN)
    }
    return this.postsRepo.deleteOnePostById(command.postId)
  }
}
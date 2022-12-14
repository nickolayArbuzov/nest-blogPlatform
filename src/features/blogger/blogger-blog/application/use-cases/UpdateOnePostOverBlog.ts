import { HttpException, HttpStatus } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { BloggerRepo } from '../../infrastructure/blogger.repo';
import { PostsRepo } from '../../../../posts/infrastructure/posts.repo';
import { UpdatePostDefaultDto } from '../../../../posts/dto/post.dto';

export class UpdateOnePostOverBlogCommand {
  constructor(
    public blogId: string,
    public postId: string,
    public postDto: UpdatePostDefaultDto,
    public userId: string,
  ) {}
}

@CommandHandler(UpdateOnePostOverBlogCommand)
export class UpdateOnePostOverBlogUseCase {
  constructor(
    private bloggerRepo: BloggerRepo,
    private postsRepo: PostsRepo,
  ) {}

  async execute(command: UpdateOnePostOverBlogCommand){
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
    return await this.postsRepo.updateOnePostById(command.postId, command.postDto)
  }
}
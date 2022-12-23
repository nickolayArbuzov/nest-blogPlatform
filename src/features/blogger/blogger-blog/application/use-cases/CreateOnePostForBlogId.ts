import { HttpException, HttpStatus } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { BloggerRepo } from '../../infrastructure/blogger.repo';
import { PostsRepo } from '../../../../posts/infrastructure/posts.repo';
import { CreatePostDefaultDto } from '../../../../posts/dto/post.dto';

export class CreateOnePostForBlogIdCommand {
  constructor(
    public id: string,
    public newPost: CreatePostDefaultDto,
    public userId: string,
  ) {}
}

@CommandHandler(CreateOnePostForBlogIdCommand)
export class CreateOnePostForBlogIdUseCase {
  constructor(
    private bloggerRepo: BloggerRepo,
    private postsRepo: PostsRepo,
  ) {}

  async execute(command: CreateOnePostForBlogIdCommand){

    const blog = await this.bloggerRepo.findOneBlogById(command.id)
    if(!blog){
      throw new HttpException('Blog not found', HttpStatus.NOT_FOUND)
    }
    if(blog.blogOwnerInfo.userId !== command.userId){
      throw new HttpException('Blog not your', HttpStatus.FORBIDDEN)
    }
    const date = new Date()
    const post = {
      title: command.newPost.title,
      shortDescription: command.newPost.shortDescription,
      content: command.newPost.content,
      blogId: command.id,
      blogName: command.id,
      createdAt: date.toISOString(),
    }

    const createdPost = await this.postsRepo.createOnePost(post)

    return {
      id: createdPost._id,
      title: createdPost.title,
      shortDescription: createdPost.shortDescription,
      content: createdPost.content,
      blogId: createdPost.blogId,
      blogName: createdPost.blogName,
      createdAt: createdPost.createdAt,
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: "None",
        newestLikes: [],
      }
    }
  }
}
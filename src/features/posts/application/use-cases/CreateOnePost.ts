import { CommandHandler } from '@nestjs/cqrs';
import { CreatePostDto } from '../../dto/post.dto';
import { PostsRepo } from '../../infrastructure/posts.repo';

export class CreateOnePostCommand {
  constructor(
    public newPost: CreatePostDto,
  ) {}
}

@CommandHandler(CreateOnePostCommand)
export class CreateOnePostUseCase {
  constructor(
    private postsRepo: PostsRepo,
  ) {}

    async execute(command: CreateOnePostCommand){
      const date = new Date()
      const post = {
        title: command.newPost.title,
        shortDescription: command.newPost.shortDescription,
        content: command.newPost.content,
        blogId: command.newPost.blogId,
        blogName: command.newPost.blogId,
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
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { queryDefault } from '../../../../helpers/constants/constants/constants';
import { QueryBlogDto } from '../../../../helpers/constants/commonDTO/query.dto';
import { CreateBlogDto, UpdateBlogDto } from '../dto/blog.dto';
import { BlogsRepo } from '../infrastructure/blogs.repo';
import { CreatePostDefaultDto } from '../../../posts/dto/post.dto';
import { PostsRepo } from '../../../posts/infrastructure/posts.repo';
import { LikesRepo } from '../../../likes/infrastructure/like.repo';

@Injectable()
export class BlogsService {
  constructor(
    private blogsRepo: BlogsRepo,
    private postsRepo: PostsRepo,
    private likesRepo: LikesRepo,
  ) {}

}
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { queryDefault } from '../../../helpers/constants/constants/constants';
import { QueryBlogDto } from '../../../helpers/constants/commonDTO/query.dto';
import { PostsRepo } from '../infrastructure/posts.repo';
import { CreatePostDto, UpdatePostDto } from '../dto/post.dto';
import { CommentsRepo } from '../../comments/infrastructure/comments.repo';

@Injectable()
export class PostsService {
  constructor(
    private postsRepo: PostsRepo,
    private commentsRepo: CommentsRepo,
  ) {}

  async findCommentsByPostId(id: string, queryParams: QueryBlogDto){
    const query = {
      pageNumber: queryParams.pageNumber || queryDefault.pageNumber,
      pageSize: queryParams.pageSize || queryDefault.pageSize,
      sortBy: queryParams.sortBy || queryDefault.sortBy,
      sortDirection: queryParams.sortDirection === 'asc' ? queryParams.sortDirection : queryDefault.sortDirection,
    }
    return await this.commentsRepo.findCommentsByPostId(id, query)
  }

  async findAllPosts(queryParams: QueryBlogDto){
    const query = {
      pageNumber: queryParams.pageNumber || queryDefault.pageNumber,
      pageSize: queryParams.pageSize || queryDefault.pageSize,
      sortBy: queryParams.sortBy || queryDefault.sortBy,
      sortDirection: queryParams.sortDirection === 'asc' ? queryParams.sortDirection : queryDefault.sortDirection,
    }
    return await this.postsRepo.findAllPosts(query)
  }

  async createOnePost(newPost: CreatePostDto){
    const date = new Date()
    const post = {
      title: newPost.title,
      shortDescription: newPost.shortDescription,
      content: newPost.content,
      blogId: newPost.blogId,
      blogName: newPost.blogId,
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

  async findOnePostById(id: string){
    const post = await this.postsRepo.findOnePostById(id)

    if(post){
      return {
        id: post._id,
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt,
        extendedLikesInfo: {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: "None",
          newestLikes: [],
        }
      }
    }
    else {
      throw new HttpException('Blog not found', HttpStatus.NOT_FOUND)
    }
  }

  async updateOnePostById(id: string, updatePost: UpdatePostDto){
    const post = await this.postsRepo.updateOnePostById(id, updatePost)
    if(post.matchedCount === 0){
      throw new HttpException('Blog not found', HttpStatus.NOT_FOUND)
    } else {
      return
    }
  }

  async deleteOnePostById(id: string){
    const post = await this.postsRepo.deleteOnePostById(id)
    if(post.deletedCount === 0){
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND)
    } else {
      return
    }
  }

}
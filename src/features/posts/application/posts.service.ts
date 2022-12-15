import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { queryDefault } from '../../../helpers/constants/constants/constants';
import { QueryBlogDto } from '../../../helpers/constants/commonDTO/query.dto';
import { PostsRepo } from '../infrastructure/posts.repo';
import { CreatePostDto, UpdatePostDto } from '../dto/post.dto';
import { CommentsRepo } from '../../comments/infrastructure/comments.repo';
import { CreateCommentDto } from '../../comments/dto/comment.dto';
import { LikesRepo } from '../../likes/infrastructure/like.repo';

@Injectable()
export class PostsService {
  constructor(
    private postsRepo: PostsRepo,
    private commentsRepo: CommentsRepo,
    private likesRepo: LikesRepo,
  ) {}

  async like(postId: string, likeStatus: string, user: {userId: string, userLogin: string}){
    const post = await this.postsRepo.findOnePostById(postId)
    if (post) {
        return await this.likesRepo.like(user, likeStatus, postId, null)
    } else {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND)
    }
  }

  async findCommentsByPostId(postId: string, queryParams: QueryBlogDto, userId: string){
    const post = await this.postsRepo.findOnePostById(postId)
    if(!post) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
    const query = {
      pageNumber: queryParams.pageNumber || queryDefault.pageNumber,
      pageSize: queryParams.pageSize || queryDefault.pageSize,
      sortBy: queryParams.sortBy || queryDefault.sortBy,
      sortDirection: queryParams.sortDirection === 'asc' ? queryParams.sortDirection : queryDefault.sortDirection,
    }
    const comments = await this.commentsRepo.findCommentsByPostId(postId, query)
    const items = []
    for await (const c of comments.items) {
      const likesInfo = await this.likesRepo.getLikesInfoForComment(c.id.toString(), userId)
      items.push({
          id: c.id,
          content: c.content,
          userId: c.userId,
          userLogin: c.userLogin,
          createdAt: c.createdAt,
          likesInfo: likesInfo,
      })
    }
    return {...comments, items: items}
  }

  async findAllPosts(queryParams: QueryBlogDto, userId: string){
    const query = {
      pageNumber: queryParams.pageNumber || queryDefault.pageNumber,
      pageSize: queryParams.pageSize || queryDefault.pageSize,
      sortBy: queryParams.sortBy || queryDefault.sortBy,
      sortDirection: queryParams.sortDirection === 'asc' ? queryParams.sortDirection : queryDefault.sortDirection,
    }
    const posts = await this.postsRepo.findAllPosts(query)
    const items = []
    for await (const p of posts.items) {
      const extendedLikesInfo = await this.likesRepo.getLikesInfoForPost(p.id.toString(), userId)
      items.push({
          id: p.id,
          title: p.title,
          shortDescription: p.shortDescription,
          content: p.content,
          blogId: p.blogId,
          blogName: p.blogName,
          createdAt: p.createdAt,
          extendedLikesInfo: extendedLikesInfo,
      })
    }
    return {...posts, items: items}
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

  async findOnePostById(id: string, userId: string){
    const post = await this.postsRepo.findOnePostById(id)

    if(post){
      const extendedLikesInfo = await this.likesRepo.getLikesInfoForPost(id, userId)
      return {
        id: post._id,
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt,
        extendedLikesInfo: extendedLikesInfo
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
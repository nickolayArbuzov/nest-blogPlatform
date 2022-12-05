import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { queryDefault } from '../../../helpers/constants/constants/constants';
import { QueryBlogDto } from '../../../helpers/constants/commonDTO/query.dto';
import { CreateBlogDto, UpdateBlogDto } from '../dto/blog.dto';
import { BlogsRepo } from '../infrastructure/blogs.repo';
import { CreatePostDefaultDto } from '../../posts/dto/post.dto';
import { PostsRepo } from '../../posts/infrastructure/posts.repo';

@Injectable()
export class BlogsService {
  constructor(
    private blogsRepo: BlogsRepo,
    private postsRepo: PostsRepo,
  ) {}

  async findAllBlogs(queryParams: QueryBlogDto){
    const query = {
      pageNumber: queryParams.pageNumber || queryDefault.pageNumber,
      pageSize: queryParams.pageSize || queryDefault.pageSize,
      sortBy: queryParams.sortBy || queryDefault.sortBy,
      sortDirection: queryParams.sortDirection === 'asc' ? queryParams.sortDirection : queryDefault.sortDirection,
      searchNameTerm: queryParams.searchNameTerm || ''
    }
    return await this.blogsRepo.findAllBlogs(query)
  }

  async createOneBlog(newBlog: CreateBlogDto){
    const date = new Date()
    const blog = {
      name: newBlog.name,
      description: newBlog.description,
      websiteUrl: newBlog.websiteUrl,
      createdAt: date.toISOString(),
    }

    const createdBlog = await this.blogsRepo.createOneBlog(blog)

    return {
      id: createdBlog._id,
      name: createdBlog.name,
      description: createdBlog.description,
      websiteUrl: createdBlog.websiteUrl,
      createdAt: createdBlog.createdAt,
    }
  }

  async findPostsByBlogId(queryParams: QueryBlogDto, id: string){
    const blog = await this.blogsRepo.findOneBlogById(id)
    if(!blog){
      throw new HttpException('Blog not found', HttpStatus.NOT_FOUND)
    }
    const query = {
      pageNumber: queryParams.pageNumber || queryDefault.pageNumber,
      pageSize: queryParams.pageSize || queryDefault.pageSize,
      sortBy: queryParams.sortBy || queryDefault.sortBy,
      sortDirection: queryParams.sortDirection === 'asc' ? queryParams.sortDirection : queryDefault.sortDirection,
      searchNameTerm: queryParams.searchNameTerm || ''
    }
    return await this.postsRepo.findAllPosts(query, id)
  }

  async createOnePostForBlogId(id: string, newPost: CreatePostDefaultDto){
    const blog = await this.blogsRepo.findOneBlogById(id)
    if(!blog){
      throw new HttpException('Blog not found', HttpStatus.NOT_FOUND)
    }
    const date = new Date()
    const post = {
      title: newPost.title,
      shortDescription: newPost.shortDescription,
      content: newPost.content,
      blogId: id,
      blogName: id,
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

  async findOneBlogById(id: string){
    const blog = await this.blogsRepo.findOneBlogById(id)
    if(blog){
      return {
        id: blog._id,
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
      }
    }
    else {
      throw new HttpException('Blog not found', HttpStatus.NOT_FOUND)
    }
  }

  async updateOneBlogById(id: string, updateBlog: UpdateBlogDto){
    const blog = await this.blogsRepo.updateOneBlogById(id, updateBlog)
    if(blog.matchedCount === 0){
      throw new HttpException('Blog not found', HttpStatus.NOT_FOUND)
    } else {
      return
    }
  }

  async deleteOneBlogById(id: string){
    const blog = await this.blogsRepo.deleteOneBlogById(id)
    if(blog.deletedCount === 0){
      throw new HttpException('Blog not found', HttpStatus.NOT_FOUND)
    } else {
      return
    }
  }
}
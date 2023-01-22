import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { QueryBlogDto } from '../../../helpers/constants/commonDTO/query.dto';
import { Post } from '../domain/entitites/post';
import { UpdatePostDefaultDto } from '../dto/post.dto';

@Injectable()
export class PostsSQL {
  constructor(
    @InjectDataSource() private readonly db: DataSource
  ) {}

  async findAllPosts(query: QueryBlogDto, id: string){
    const orderByWithDirection = `"${query.sortBy}" ${query.sortDirection}`
    const whereStatment = id ? `where "blogId" = ${"'"+id+"'"}` : ''
    const posts = await this.db.query(
      `
        select id, title, "shortDescription", content, "blogId", "blogName", "createdAt"
        from posts
        ${whereStatment}
        order by ${orderByWithDirection} 
        limit $2
        offset $1
      `,
      [(+query.pageNumber-1) * +query.pageSize, query.pageSize]
    )
    const totalCount = await this.db.query(
      `
        select count(*) 
        from posts
        ${whereStatment}
      `,
    )

    return {
      pagesCount: Math.ceil(+totalCount[0].count/+query.pageSize),
      page: +query.pageNumber,
      pageSize: +query.pageSize,
      totalCount: +totalCount[0].count,
      items: posts.map(i => {
        return {
          id: i.id, 
          title: i.title, 
          shortDescription: i.shortDescription,
          content: i.content,
          blogId: i.blogId,
          blogName: i.blogName,
          createdAt: i.createdAt,
        }
      }),
    }
  }

  async createOnePost(newPost: Post){
    const createPost = await this.db.query(
      `
        insert into posts
        (title, "shortDescription", content, "blogId", "blogName", "createdAt")
        values ($1, $2, $3, $4, $5, $6)
        returning id, title, "shortDescription", content, "blogId", "blogName", "createdAt"
      `, 
      [
        newPost.title, newPost.shortDescription, newPost.content, newPost.blogId, newPost.blogName, newPost.createdAt,
      ]
    )
    return {
      _id: createPost[0].id.toString(),
      title: createPost[0].title,
      shortDescription: createPost[0].shortDescription,
      content: createPost[0].content,
      blogId: createPost[0].blogId,
      blogName: createPost[0].blogName,
      createdAt: createPost[0].createdAt,
    }
  }

  async findOnePostById(id: string){
    const post = await this.db.query(
      `
        select * from posts
        where id = $1
      `,
      [id]
    )
    if(post[0]){
      return {
        _id: post[0].id,
        title: post[0].title,
        shortDescription: post[0].shortDescription,
        content: post[0].content,
        blogId: post[0].blogId,
        blogName: post[0].blogName,
        createdAt: post[0].createdAt,
      }
    } else {
      return null
    }
  }

  async updateOnePostById(id: string, updatePost: UpdatePostDefaultDto){
    return await this.db.query(
      `
        update posts
        set title = $2, "shortDescription" = $3, content = $4
        where id = $1
      `,
      [id, updatePost.title, updatePost.shortDescription, updatePost.content]
    )
  }

  async deleteOnePostById(id: string){
    return await this.db.query(
      `
        delete from posts
        where id = $1
      `,
      [id]
    )
  }
}
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { QueryBlogDto } from '../../../../helpers/constants/commonDTO/query.dto';
import { Blog } from '../../../../shared/collections/Blog/blogger';
import { UpdateBlogDto } from '../dto/blogger.dto';

@Injectable()
export class BloggerSQL {
  constructor(
    @InjectDataSource() private readonly db: DataSource
  ) {}

  async findAllBlogs(query: QueryBlogDto, userId: string){
    const orderByWithDirection = `"${query.sortBy}" ${query.sortDirection}`
    const blogs = await this.db.query(
      `
        select id, name, description, "websiteUrl", "createdAt"
        from blogs
        where lower(name) like $3 and "ownerUserId" = $4
        order by ${orderByWithDirection} 
        limit $2
        offset $1
      `,
      [(+query.pageNumber-1) * +query.pageSize, query.pageSize, `%${query.searchNameTerm.toLocaleLowerCase()}%`, userId]
    )
    const totalCount = await this.db.query(
      `
        select count(*) 
        from blogs
        where lower(name) like $1 and "ownerUserId" = $2
      `,
      [`%${query.searchNameTerm.toLocaleLowerCase()}%`, userId]
    )

    return {
      pagesCount: Math.ceil(+totalCount[0].count/+query.pageSize),
      page: +query.pageNumber,
      pageSize: +query.pageSize,
      totalCount: +totalCount[0].count,
      items: blogs.map(i => {
        return {
          id: i.id.toString(), 
          name: i.name, 
          description: i.description,
          websiteUrl: i.websiteUrl,
          createdAt: i.createdAt,
        }
      }),
    }
  }

  async createOneBlog(newBlog: Blog){
    const createBlog = await this.db.query(
      `
        insert into blogs
        (name, description, "websiteUrl", "createdAt", "ownerUserId", "ownerUserLogin", "isBanned", "banDate")
        values ($1, $2, $3, $4, $5, $6, $7, $8)
        returning id, name, description, "websiteUrl", "createdAt"
      `, 
      [
        newBlog.name, newBlog.description, newBlog.websiteUrl, newBlog.createdAt,
        newBlog.blogOwnerInfo.userId, newBlog.blogOwnerInfo.userLogin,
        newBlog.banInfo.isBanned, newBlog.banInfo.banDate,
      ]
    )
    return {
      _id: createBlog[0].id.toString(),
      name: createBlog[0].name,
      description: createBlog[0].description,
      websiteUrl: createBlog[0].websiteUrl,
      createdAt: createBlog[0].createdAt,
    }
  }

  async findOneBlogById(id: string){
    const blog = await this.db.query(
      `
        select *
        from blogs
        where id = $1
      `,
      [id]
    )
    if(blog[0]){
      return {
        _id: blog[0].id,
        name: blog[0].name,
        description: blog[0].description,
        websiteUrl: blog[0].websiteUrl,
        createdAt: blog[0].createdAt,
        blogOwnerInfo: {
          userId: blog[0].ownerUserId, 
          userLogin: blog[0].ownerUserLogin,
        },
        banInfo: {
          isBanned: blog[0].isBanned, 
          banDate: blog[0].banDate, 
        },
      }
    } else {
      return null
    }
  }

  async updateOneBlogById(id: string, updateBlog: UpdateBlogDto){
    const blog = await this.db.query(
      `
        update blogs
        set name = $2, "websiteUrl" = $3, description = $4
        where id = $1
      `,
      [id, updateBlog.name, updateBlog.websiteUrl, updateBlog.description]
    )
    return blog
  }

  async deleteOneBlogById(id: string){
    const deleteBlog = await this.db.query(
      `
        delete from blogs
        where id = $1
      `,
      [id]
    )
    return deleteBlog
  }
}
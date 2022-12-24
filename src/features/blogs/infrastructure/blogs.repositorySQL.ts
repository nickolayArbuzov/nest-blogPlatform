import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { QueryBlogDto } from '../../../helpers/constants/commonDTO/query.dto';

@Injectable()
export class BlogsSQL {
  constructor(
    @InjectDataSource() private readonly db: DataSource
  ) {}

  async findAllBlogs(query: QueryBlogDto){
    const orderByWithDirection = `"${query.sortBy}" ${query.sortDirection}`
    const blogs = await this.db.query(
      `
        select id, name, description, "websiteUrl", "createdAt", "ownerUserId", "ownerUserLogin", "isBanned", "banDate"
        from blogs
        where lower(name) like $3 and "isBanned" = false
        order by ${orderByWithDirection} 
        limit $2
        offset $1
      `,
      [(+query.pageNumber-1) * +query.pageSize, query.pageSize, `%${query.searchNameTerm.toLocaleLowerCase()}%`]
    )
    const totalCount = await this.db.query(
      `
        select count(*) 
        from blogs
        where lower(name) like $1
      `,
      [`%${query.searchNameTerm.toLocaleLowerCase()}%`]
    )

    return {
      pagesCount: Math.ceil(+totalCount[0].count/+query.pageSize),
      page: +query.pageNumber,
      pageSize: +query.pageSize,
      totalCount: +totalCount[0].count,
      items: blogs.map(i => {
        return {
          id: i.id, 
          name: i.name, 
          description: i.description,
          websiteUrl: i.websiteUrl,
          createdAt: i.createdAt,
        }
      }),
    }
  }

  async findOneBlogById(id: string){
    const blog = await this.db.query(
      `
        select * from blogs
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
        }
      }
    } else {
      return null
    }
  }
}
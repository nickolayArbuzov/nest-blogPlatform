import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { QueryBlogDto } from '../../../../helpers/constants/commonDTO/query.dto';
import { BanBlogInfo, Blog } from '../../../../shared/collections/Blog/blogger';

@Injectable()
export class BlogsSQL {
  constructor(
    @InjectDataSource() private readonly db: DataSource
  ) {}

  async banOneBlogById(blogId: string, banInfo: BanBlogInfo){
    return await this.db.query(
      `
        update blogs
        set "banDate" = $2, "isBanned" = $3
        where id = $1
      `,
      [blogId, banInfo.banDate, banInfo.isBanned]
    )
  }

  async findAllBlogs(query: QueryBlogDto){
    const orderByWithDirection = `"${query.sortBy}" ${query.sortDirection}`
    const blogs = await this.db.query(
      `
        select id, name, description, "websiteUrl", "createdAt", "ownerUserId", "ownerUserLogin", "isBanned", "banDate"
        from blogs
        where lower(name) like $3
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
          id: i.id.toString(), 
          name: i.name, 
          description: i.description,
          websiteUrl: i.websiteUrl,
          createdAt: i.createdAt,
          blogOwnerInfo: {
            userId: i.ownerUserId, 
            userLogin: i.ownerUserLogin,
          },
          banInfo: {
            isBanned: i.isBanned, 
            banDate: i.banDate,
          },
        }
      }),
    }
  }
}
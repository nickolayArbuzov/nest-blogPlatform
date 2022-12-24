import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { QueryUserDto } from '../../../../helpers/constants/commonDTO/query.dto';
import { BanUserBlogDto } from '../../../../shared/dto/ban.dto';

@Injectable()
export class BloggerUserSQL {
  constructor(
    @InjectDataSource() private readonly db: DataSource
  ) {}

  async banUserById(userId: string, banUserBlogDto: BanUserBlogDto){
    if(banUserBlogDto.isBanned){
      const position = await this.db.query(
        `
          select * 
          from "bloggerUser"
          where "blogId" = $1 and "bannedUserId" = $2
        `,
        [banUserBlogDto.blogId, userId]
      )
      if(position[0]){
        return true
      } else {
        const date = new Date()
        return await this.db.query(
          `
            insert into "bloggerUser"
            ("blogId", "bannedUserId", "banDate", "banReason")
            values ($1, $2, $3, $4)
          `, 
          [banUserBlogDto.blogId, userId, date.toISOString(), banUserBlogDto.banReason]
        )
      }
    } else {
      return await this.db.query(
        `
          delete from "bloggerUser"
          where "blogId" = $1 and "bannedUserId" = $2
        `,
        [banUserBlogDto.blogId, userId]
      )
    }
  }

  async findAllBannedUsersByBlogId(query: QueryUserDto, blogId: string){
    const bannedUsers = await this.db.query(
      `
        select "bannedUserId", "banDate", "banReason" 
        from "bloggerUser"
        where "blogId" = $1
      `,
      [blogId]
    )

    const orderByWithDirection = `"${query.sortBy}" ${query.sortDirection}`
    let users
    let totalCount
    if(bannedUsers.length){
      users = await this.db.query(
        `
          select *
          from users
          where id in (${bannedUsers.map(bu => `'${bu.bannedUserId}'`).join(',')}) and (lower(email) like $3 or lower(login) like $4)
          order by ${orderByWithDirection} 
          limit $2
          offset $1
        `,
        [(+query.pageNumber-1) * +query.pageSize, query.pageSize, `%${query.searchEmailTerm.toLocaleLowerCase()}%`, `%${query.searchLoginTerm.toLocaleLowerCase()}%`]
      )
      totalCount = await this.db.query(
        `
          select count(*) 
          from users
          where id in (${bannedUsers.map(bu => `'${bu.bannedUserId}'`).join(',')}) and (lower(email) like $1 or lower(login) like $2)
        `,
        [`%${query.searchEmailTerm.toLocaleLowerCase()}%`, `%${query.searchLoginTerm.toLocaleLowerCase()}%`]
      )
    }

    return {    
      pagesCount: bannedUsers.length ? Math.ceil(+totalCount[0].count/+query.pageSize) : 0,
      page: +query.pageNumber,
      pageSize: +query.pageSize,
      totalCount: bannedUsers.length ? +totalCount[0].count : 0,
      items: bannedUsers.length ? users.map(i => {
          return {
            id: i.id, 
            login: i.login, 
            banInfo: {
              banDate: bannedUsers.find(bu => i.id.toString() === bu.bannedUserId)?.banDate, 
              banReason: bannedUsers.find(bu => i.id.toString() === bu.bannedUserId)?.banReason, 
              isBanned: true,
            },
          }
      }) : [],
    }
  }

  async findBannedPosition(blogId: string, userId: string){
    const bannedPosition = await this.db.query(
      `
        select *
        from "bloggerUser"
        where "blogId" = $1 and "bannedUserId" = $2
      `,
      [blogId, userId]
    )
    return bannedPosition[0]
  }
}
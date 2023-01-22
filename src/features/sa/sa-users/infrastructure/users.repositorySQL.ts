import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, QueryRunner } from 'typeorm';
import { QueryUserDto } from '../../../../helpers/constants/commonDTO/query.dto';
import { BanInfo, User } from '../domain/entitites/user';

@Injectable()
export class UsersSQL {
  constructor(
    @InjectDataSource() private readonly db: DataSource
  ) {}

  async banOneUserById(id: string, banInfo: BanInfo){
    const banUser = await this.db.query(
      `
        update users
        set "isBanned" = $2, "banDate" = $3, "banReason" = $4
        where id = $1
      `,
      [id, banInfo.isBanned, banInfo.banDate, banInfo.banReason]
    )
    return banUser[1]
  }

  async findAllUsers(query: QueryUserDto){
    
    const banCondition = query.banStatus === 'all' ? [true, false] : query.banStatus === 'banned' ? [true] : [false]
    const orderByWithDirection = `"${query.sortBy}" ${query.sortDirection}`
    const users = await this.db.query(
      `
        select id, "createdAt", email, login, "isBanned", "banDate", "banReason" 
        from users
        where "isBanned" in (${banCondition}) and (lower(email) like $3 or lower(login) like $4)
        order by ${orderByWithDirection} 
        limit $2
        offset $1
      `,
      [(+query.pageNumber-1) * +query.pageSize, query.pageSize, `%${query.searchEmailTerm.toLocaleLowerCase()}%`, `%${query.searchLoginTerm.toLocaleLowerCase()}%`]
    )
    const totalCount = await this.db.query(
      `
        select count(*) 
        from users
        where "isBanned" in (${banCondition}) and (lower(email) like $1 or lower(login) like $2)
      `,
      [`%${query.searchEmailTerm.toLocaleLowerCase()}%`, `%${query.searchLoginTerm.toLocaleLowerCase()}%`]
    )

    return {
      pagesCount: Math.ceil(+totalCount[0].count/+query.pageSize),
      page: +query.pageNumber,
      pageSize: +query.pageSize,
      totalCount: +totalCount[0].count,
      items: users.map(i => {
        return {
          id: i.id.toString(), 
          login: i.login, 
          email: i.email,
          createdAt: i.createdAt,
          banInfo: {
            isBanned: i.isBanned,
            banDate: i.banDate,
            banReason: i.banReason,
          },
        }
      }),
    }
  }

  async createOneUser(newUser: User){
    
    const createUser = await this.db.query(
      `
        insert into users 
        (login, email, "passwordHash", "passwordSalt", "isActivated", code, "createdAt", "isBanned", "banDate", "banReason")
        values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        returning id, login, email, "createdAt", "isBanned", "banDate", "banReason"
      `, 
      [
        newUser.login, newUser.email, newUser.passwordHash, newUser.passwordSalt, newUser.isActivated, newUser.code, 
        newUser.createdAt, newUser.banInfo.isBanned, newUser.banInfo.banDate, newUser.banInfo.banReason
      ]
    )
    return {
      _id: createUser[0].id.toString(),
      login: createUser[0].login,
      email: createUser[0].email,
      createdAt: createUser[0].createdAt,
      banInfo: {
        isBanned: createUser[0].isBanned,
        banDate: createUser[0].banDate,
        banReason: createUser[0].banReason,
      },
    }
  }

  async deleteOneUserById(id: string){
    const deleteUser = await this.db.query(
      `
        delete from users
        where id = $1
      `,
      [id]
    )
    return {
      deletedCount: deleteUser[1]
    }
  }

  async passwordRecovery(email: string, code: string){
    const updateUser = await this.db.query(
      `
        update users
        set code = $2
        where email = $1
      `,
      [email, code]
    )
    return updateUser[1] === 1
  }

  async newPassword(passwordHash: string, passwordSalt: string, recoveryCode: string){
    return await this.db.query(
      `
        update users
        set "passwordHash" = $1, "passwordSalt" = $2, "isActivated" = true
        where code = $3
      `,
      [passwordHash, passwordSalt, recoveryCode]
    )
  }

  async findByLoginOrEmail(loginOrEmail: string){
    const user = await this.db.query(
      `
        select id, "passwordSalt", "passwordHash", login, "isBanned"
        from users
        where email = $1 or login = $1
      `,
      [loginOrEmail]
    )
    if(user[0]) {
      return {
        passwordSalt: user[0].passwordSalt,
        passwordHash: user[0].passwordHash,
        id: user[0].id,
        login: user[0].login,
        banInfo: {
          isBanned: user[0].isBanned,
        },
      }
    } else {
      return null
    }
  }

  async findOneUserById(userId: string){
    const user = await this.db.query(
      `
        select id, "isBanned"
        from users
        where id = $1
      `,
      [userId]
    )
    if(user[0]){
      return {
        id: user[0].id,
        banInfo: {
          isBanned: user[0].isBanned,
        },
      }
    } else {
      return null
    }
  }

  async findOneForCustomDecoratorByLogin(login: string) {
    const user = await this.db.query(
      `
        select id
        from users
        where login = $1
      `,
      [login]
    )
    return user[0] ? user[0] : null
  }

  async findOneForCustomDecoratorByEmail(email: string) {
    const user = await this.db.query(
      `
        select id
        from users
        where email = $1
      `,
      [email]
    )
    return user[0] ? user[0] : null
  }

  async findOneForCustomDecoratorByCode(code: string) {
    const user = await this.db.query(
      `
        select id, "isActivated"
        from users
        where code = $1
      `,
      [code]
    )
    return user[0] && user[0].isActivated !== true ? user[0] : null
  }

  async findOneForCustomDecoratorCheckMail(email: string) {
    const user = await this.db.query(
      `
        select id, "isActivated"
        from users
        where email = $1
      `,
      [email]
    )
    return user[0] && user[0].isActivated !== true ? user[0] : null
  }

  async registrationConfirmation(code: string) {
    return await this.db.query(
      `
        update users
        set "isActivated" = true
        where code = $1
      `,
      [code]
    )
  }

  async registrationEmailResending(email: string, code: string){
    return await this.db.query(
      `
        update users
        set code = $2
        where email = $1
      `,
      [email, code]
    )
  }
 
  async authMe(userId: string){
    const user = await this.db.query(
      `
        select id, email, login
        from users
        where id = $1
      `, 
      [userId]
    )
    return {
      email: user[0].email,
      login: user[0].login,
      id: user[0].id,
    }
  }
}
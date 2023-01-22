import { BadRequestException, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { useContainer } from 'class-validator';
import * as request from 'supertest';
import { HttpExceptionFilter } from '../src/helpers/filters/http-exeption.filter';
import { AppModule } from '../src/app.module'
import * as constants from './constants';

jest.setTimeout(60000)
describe('AppController', () => {
  let app: INestApplication
  let server: any
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    app.useGlobalPipes(new ValidationPipe({
    stopAtFirstError: true,
    transform: true,
    exceptionFactory: (errors) => {
      const customErrors = [];
      errors.forEach(e => {
        const keys = Object.keys(e.constraints)
        keys.forEach(k => {
          customErrors.push({
            message: e.constraints[k],
            field: e.property,
          })
        })
      })
      throw new BadRequestException(customErrors)
    }
  }))
  app.useGlobalFilters(new HttpExceptionFilter())
    await app.init()
    server = app.getHttpServer()
  });

  afterAll(async () => {
    app.close()
  })

  describe('sa-user-controller', () => {
    it('should delete all data', async () => {
      await request(server).delete('/testing/all-data').expect(204)
    })

    it('should create new User', async () => {
      const response = await request(server).post('/sa/users')
        .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
        .send(constants.createUser1)
        .expect(201);

      expect(response.body).toStrictEqual({
        id: expect.any(String),
        login: constants.createUser1.login,
        email: constants.createUser1.email,
        createdAt: expect.any(String),
        banInfo: {
          isBanned: false,
          banDate: null,
          banReason: null,
        },
      });

      constants.variables.setUserId(response.body.id)
    });

    it('should banned and unbannsed user', async () => {
      await request(server).put(`/sa/users/${constants.variables.userId}/ban`)
        .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
        .send(constants.ban);

      const bannedUser = await request(server).get(`/sa/users`)
        .set('Authorization', 'Basic YWRtaW46cXdlcnR5')

      expect(bannedUser.body.items[0]).toStrictEqual({
        createdAt: expect.any(String),
        email: expect.any(String),
        id: constants.variables.userId,
        login: expect.any(String),
        banInfo: {
          isBanned: constants.ban.isBanned,
          banDate: expect.any(String),
          banReason: constants.ban.banReason,
        },
      })

      await request(server).put(`/sa/users/${constants.variables.userId}/ban`)
        .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
        .send(constants.unban);

      const unBannedUser = await request(server).get(`/sa/users`)
        .set('Authorization', 'Basic YWRtaW46cXdlcnR5')

      expect(unBannedUser.body.items[0]).toStrictEqual({
        createdAt: expect.any(String),
        email: expect.any(String),
        id: constants.variables.userId,
        login: expect.any(String),
        banInfo: {
          isBanned: constants.unban.isBanned,
          banDate: null,
          banReason: null,
        },
      })
    });

    it('should succes login user without ban, and return 401 if user with ban', async () => {
      await request(server).post('/auth/login')
        .send(constants.correctLoginUser)
        .expect(200)

      await request(server).put(`/sa/users/${constants.variables.userId}/ban`)
        .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
        .send(constants.ban)
      
      await request(server).post('/auth/login')
        .send(constants.correctLoginUser)
        .expect(401)

      await request(server).put(`/sa/users/${constants.variables.userId}/ban`)
        .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
        .send(constants.unban)

      await request(server).post('/auth/login')
        .send(constants.correctLoginUser)
        .expect(200)
    });

    it('should return errors and 400 if try create user with incorrect data', async () => {
      const response = await request(server).post('/sa/users')
        .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
        .send(constants.incorrectCreateUser)
        .expect(400);

      expect(response.body).toStrictEqual({errorsMessages: [
        {field: "login", message: "login must be longer than or equal to 3 characters"},
        {field: "password", message: "password must be longer than or equal to 6 characters"},
        {field: "email", message: "email must match /^([\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$)/ regular expression"},
      ]});
    });

    it('should return filtered array of users with pagination and sorting', async () => {
      await request(server).post('/sa/users').set('Authorization', 'Basic YWRtaW46cXdlcnR5')
        .send(constants.createUser2)
        .expect(201);
      await request(server).post('/sa/users').set('Authorization', 'Basic YWRtaW46cXdlcnR5')
        .send(constants.createUser3)
        .expect(201);
      await request(server).post('/sa/users').set('Authorization', 'Basic YWRtaW46cXdlcnR5')
        .send(constants.createUser4)
        .expect(201);

      const users = await request(server)
        .get(`/sa/users?pageNumber=${constants.queryUser.pageNumber}&pageSize=${constants.queryUser.pageSize}&sortDirection=${constants.queryUser.sortDirection}&searchEmailTerm=${constants.queryUser.searchEmailTerm}&searchLoginTerm=${constants.queryUser.searchLoginTerm}`)
        .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
        .expect(200)
      
      expect(users.body.pagesCount).toBe(1)
      expect(users.body.page).toBe(+constants.queryUser.pageNumber)
      expect(users.body.pageSize).toBe(+constants.queryUser.pageSize)
      expect(users.body.totalCount).toBe(2)
      expect(users.body.items.length).toBe(2)
      expect(users.body.items[0].login).toBe('login-3')

      expect(users.body).toStrictEqual(0)
    });

    it('should return full array of users with default-pagination-sorting', async () => {
      const users = await request(server)
        .get('/sa/users').set('Authorization', 'Basic YWRtaW46cXdlcnR5')
        .expect(200)

      expect(users.body.pagesCount).toBe(1)
      expect(users.body.page).toBe(1)
      expect(users.body.pageSize).toBe(10)
      expect(users.body.totalCount).toBe(4)
      expect(users.body.items.length).toBe(4)
      expect(users.body.items[3].login).toBe('login-1')
    });

    it('should return status 404 if finding user not found', async () => {
      await request(server).get(`/sa/users/${constants.variables.incorrectAnyUUID}`)
        .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
        .expect(404)
    });

    it('should return status 204 if deleting user', async () => {
      await request(server).delete(`/sa/users/${constants.variables.userId}`)
        .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
        .expect(204)
    });

    it('should return status 404 if deleting user not found', async () => {
      await request(server).delete(`/sa/users/${constants.variables.userId}`)
        .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
        .expect(404)
    });

  });
});
